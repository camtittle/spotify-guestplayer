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

        private const int MAX_PENDING_REQS = 5;

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
            if (party == null || party.Ended)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }

            var pendingRequests = await _trackRequestService.GetPendingTrackRequestsForUser(partyId, userId);

            if (pendingRequests.Length >= MAX_PENDING_REQS)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.TOO_MANY_PENDING_REQUESTS));
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

        [HttpGet("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host)]
        public async Task<ActionResult> GetRequests()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var partyId = HttpContext.GetPartyId();

            var trackRequests = await _trackRequestService.GetTrackRequests(partyId);

            var response = trackRequests.Select(x => new TrackRequestResponse()
            {
                Id = x.Id,
                SpotifyTrackId = x.SpotifyTrackId,
                Title = x.Title,
                Artist = x.Artist,
                ArtworkUrl = x.ArtworkUrl,
                Album = x.Album,
                CreatedAt = x.CreatedAt
            });

            return Ok(response);
        }

        [HttpGet("guest")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Guest)]
        public async Task<ActionResult> GetGuestRequests()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var partyId = HttpContext.GetPartyId();
            var userId = HttpContext.GetUserId();

            var trackRequests = await _trackRequestService.GetPendingTrackRequestsForUser(partyId, userId);

            var response = trackRequests.Select(x => new TrackRequestResponse()
            {
                Id = x.Id,
                SpotifyTrackId = x.SpotifyTrackId,
                Title = x.Title,
                Artist = x.Artist,
                ArtworkUrl = x.ArtworkUrl,
                Album = x.Album,
                CreatedAt = x.CreatedAt
            });

            return Ok(response);
        }

        [HttpGet("count")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host)]
        public async Task<ActionResult<GetRequestCountResponse>> GetRequestCount()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var partyId = HttpContext.GetPartyId();

            var trackRequestCount = await _trackRequestService.GetTrackRequestCount(partyId);

            var response = new GetRequestCountResponse()
            {
                Count = trackRequestCount
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host)]
        public async Task<ActionResult> DeleteRequest(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var hostPartyId = HttpContext.GetPartyId();

            await _trackRequestService.DeleteTrackRequest(hostPartyId, id);

            return NoContent();
        }

        [HttpPost("{id}/play")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host)]
        public async Task<ActionResult> PlayRequest(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var hostPartyId = HttpContext.GetPartyId();

            try
            {
                await _trackRequestService.AcceptTrackRequest(hostPartyId, id, PlayType.PlayNow);
            }
            catch (ActivePlayerDeviceNotFound)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.ACTIVE_PLAYER_DEVICE_NOT_FOUND));
            }

            return NoContent();
        }

        [HttpPost("{id}/queue")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Host)]
        public async Task<ActionResult> QueueRequest(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var hostPartyId = HttpContext.GetPartyId();

            try
            {
                await _trackRequestService.AcceptTrackRequest(hostPartyId, id, PlayType.AddToQueue);
            } catch (ActivePlayerDeviceNotFound)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.ACTIVE_PLAYER_DEVICE_NOT_FOUND));
            }

            return NoContent();
        }

    }
}
