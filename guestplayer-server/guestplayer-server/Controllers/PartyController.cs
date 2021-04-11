using Domain.DTOs;
using Domain.Interfaces.Services;
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

        public PartyController(IPartyService partyService)
        {
            _partyService = partyService;
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
                    ExpiresIn = request.SpotifyCredentials.ExpiresIn
                }
            };

            var party = await _partyService.CreateParty(partyParams);

            return new PartyResponse()
            {
                Id = party.Id,
                Name = party.Name
            };
        }
    }
}
