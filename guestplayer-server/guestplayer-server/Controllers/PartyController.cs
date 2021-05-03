using Domain.DTOs;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces.Services;
using guestplayer_server.Helpers;
using guestplayer_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartyController : Controller
    {

        private readonly IPartyService _partyService;
        private readonly JwtService _jwtService;

        public PartyController(IPartyService partyService, JwtService jwtService)
        {
            _partyService = partyService;
            _jwtService = jwtService;
        }

        [HttpPost("create")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PartyResponse>> CreateParty(CreatePartyRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var partyParams = new CreatePartyParams()
            {
                PartyName = request.Name,
                SpotifyCredentials = new Domain.Entities.SpotifyCredentials()
                {
                    AccessToken = request.SpotifyCredentials.AccessToken,
                    RefreshToken = request.SpotifyCredentials.RefreshToken,
                    ExpiresAt = request.SpotifyCredentials.ExpiresAt
                }
            };

            var party = await _partyService.CreateParty(partyParams);

            var jwt = _jwtService.generateJwt(party.PartyId, JwtRole.HOST);

            var response = new PartyResponse()
            {
                Id = party.PartyId,
                Name = party.Name,
                Token = jwt
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PartySummary>> GetParty(string id)
        {
            if (id == null)
            {
                return BadRequest();
            }

            var party = await _partyService.GetParty(id);

            if (party == null)
            {
                return NotFound();
            }

            var response = new PartySummary
            {
                Id = id,
                Name = party.Name
            };

            return Ok(response);
        }

        [HttpPost("{id}/join")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> JoinParty(string id)
        {
            if (id == null)
            {
                return BadRequest("Id required");
            }

            try
            {
                var party = await _partyService.JoinParty(id);

                var jwt = _jwtService.generateJwt(party.PartyId, JwtRole.GUEST);

                var response = new PartyResponse()
                {
                    Id = party.PartyId,
                    Name = party.Name,
                    GuestCount = party.GuestCount,
                    Token = jwt
                };

                return Ok(response);

            } catch (NotFoundException)
            {
                return BadRequest("Party not found");
            }
        }
    }
}
