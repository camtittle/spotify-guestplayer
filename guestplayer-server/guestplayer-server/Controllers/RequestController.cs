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
    public class RequestController : ControllerBase
    {
        private readonly IPartyService _partyService;
        private readonly ITrackRequestService _trackRequestService;

        public RequestController(IPartyService partyService, ITrackRequestService trackRequestService)
        {
            _partyService = partyService;
            _trackRequestService = trackRequestService;
        }

        [HttpPost("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Guest)]
        public async Task<ActionResult> RequestTrack(RequestTrackRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var partyId = HttpContext.GetPartyId();
            var userId = HttpContext.GetUserId();

            var party = await _partyService.GetParty(partyId);
            if (party == null)
            {
                return BadRequest("Party doesn't exist");
            }

            var createTrackRequestParams = new CreateTrackRequestParams()
            {
                Party = party,
                UserId = userId,
                SpotifyTrackId = request.TrackId
            };

            try
            {
                var trackRequest = await _trackRequestService.CreateTrackRequest(createTrackRequestParams);
                return Ok(trackRequest);
            } catch (NotFoundException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.TRACK_NOT_FOUND));
            }
        }

    }
}
