using Domain.DTOs;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces.Services;
using guestplayer_server.Constants;
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
        private readonly IRefreshTokenService _refreshTokenService;

        public PartyController(IPartyService partyService, JwtService jwtService, IRefreshTokenService refreshTokenService)
        {
            _partyService = partyService;
            _jwtService = jwtService;
            _refreshTokenService = refreshTokenService;
        }

        private async Task GenerateRefreshToken(string partyId, string userId, Role role)
        {
            var refreshToken = await _refreshTokenService.CreateRefreshToken(partyId, userId, role);

            // Add refresh token as cookie
            var cookieOptions = new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.None, // This is fine because we have CORS,
                Expires = new DateTimeOffset(DateTime.UtcNow.AddDays(7))
            };

            Response.Cookies.Append(AuthConstants.REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
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

            var userId = Guid.NewGuid().ToString();
            var jwt = _jwtService.generateJwt(party.PartyId, userId, JwtRole.HOST);
            await GenerateRefreshToken(party.Id, userId, Role.Host);

            var response = new PartyResponse()
            {
                Id = party.PartyId,
                Name = party.Name,
                Token = jwt,
                GuestCount = 0,
                Role = JwtRole.HOST
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

            if (party == null || party.Ended)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }

            var response = new PartySummary
            {
                Id = id,
                Name = party.Name
            };

            return Ok(response);
        }

        [HttpGet("{id}/cohost/token")]
        [Authorize(Role.Host)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PartySummary>> GetCohostJoinToken(string id)
        {
            if (id == null)
            {
                return BadRequest();
            }

            var party = await _partyService.GetParty(id);

            if (party == null || party.Ended)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }

            var response = new PartyCohostJoinTokenResponse
            {
                JoinToken = party.CohostJoinToken
            };

            return Ok(response);
        }

        [HttpPost("leave")]
        [Authorize(Role.Guest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> LeaveParty()
        {
            var partyId = HttpContext.GetPartyId();
            var userId = HttpContext.GetUserId();

            var party = await _partyService.GetParty(partyId);

            if (party == null || party.Ended)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }

            await _partyService.LeaveParty(userId, party);

            return NoContent();
        }

        [HttpDelete("")]
        [Authorize(Role.Host)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> EndParty()
        {
            var partyId = HttpContext.GetPartyId();

            var party = await _partyService.GetParty(partyId);

            if (party == null)
            {
                return NoContent();
            }

            await _partyService.EndParty(partyId);

            return NoContent();
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

                var userId = Guid.NewGuid().ToString();
                var jwt = _jwtService.generateJwt(party.PartyId, userId, JwtRole.GUEST);
                await GenerateRefreshToken(party.Id, userId, Role.Guest);

                var response = new PartyResponse()
                {
                    Id = party.PartyId,
                    Name = party.Name,
                    GuestCount = party.GuestCount,
                    Token = jwt,
                    Role = JwtRole.GUEST
                };

                return Ok(response);

            } catch (NotFoundException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }
        }

        [HttpPost("{id}/cohost")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CohostParty(string id, [FromBody] CohostPartyRequest request)
        {
            if (id == null)
            {
                return BadRequest("Id required");
            }

            if (request == null || request.JoinToken == null)
            {
                return BadRequest("JoinToken required");
            }

            try
            {
                var userId = Guid.NewGuid().ToString();
                var party = await _partyService.AddCohost(id, userId, request.JoinToken);

                var jwt = _jwtService.generateJwt(party.PartyId, userId, JwtRole.COHOST);
                await GenerateRefreshToken(party.Id, userId, Role.Cohost);

                var response = new PartyResponse()
                {
                    Id = party.PartyId,
                    Name = party.Name,
                    GuestCount = party.GuestCount,
                    Token = jwt,
                    Role = JwtRole.COHOST
                };

                return Ok(response);

            }
            catch (NotFoundException)
            {
                return NotFound();
            } catch (PartyEndedException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            } catch (TokenInvalidException)
            {
                return BadRequest("Invalid join token");
            }
        }
    }
}
