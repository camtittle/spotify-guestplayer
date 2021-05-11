using Domain.Enums;
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
    public class SpotifyController : ControllerBase
    {
        private readonly IHostSpotifyService _hostSpotifyService;
        private readonly IGuestSpotifyService _guestSpotifyService;

        public SpotifyController(IHostSpotifyService hostSpotifyService, IGuestSpotifyService guestSpotifyService)
        {
            _hostSpotifyService = hostSpotifyService;
            _guestSpotifyService = guestSpotifyService;
        }

        [HttpPost("token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> GetToken(GetSpotifyAccessTokenRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var tokens = await _hostSpotifyService.GetAccessToken(request.Code);

            var response = new GetSpotifyAccessTokenResponse
            {
                AccessToken = tokens.AccessToken,
                RefreshToken = tokens.RefreshToken,
                ExpiresAt = tokens.ExpiresAt
            };

            return Ok(response);
        }

        [HttpGet("tracks/{searchTerm}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Role.Guest)]
        public async Task<ActionResult<TrackResponse>> SearchTracks(string searchTerm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.ValidationState);
            }

            var tracks = await _guestSpotifyService.SearchTracks(searchTerm);

            var response = tracks.Select(track => new TrackResponse()
            {
                Id = track.Id,
                Title = track.Title,
                Artist = track.Artist,
                ArtworkUrl = track.ArtworkUrl,
                Album = track.Album,
                DurationMs = track.DurationMs
            });

            return Ok(response);
        }


    }
}
