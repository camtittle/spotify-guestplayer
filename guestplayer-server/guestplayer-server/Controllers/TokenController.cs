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
    public class TokenController : ControllerBase
    {

        private readonly IRefreshTokenService _refreshTokenService;
        private readonly JwtService _jwtService;

        public TokenController(IRefreshTokenService refreshTokenService, JwtService jwtService)
        {
            _refreshTokenService = refreshTokenService;
            _jwtService = jwtService;
        }

        private async Task GenerateRefreshToken(string partyId, string userId, Role role)
        {
            var refreshToken = await _refreshTokenService.CreateRefreshToken(partyId, userId, role);

            // Add refresh token as cookie
            var cookieOptions = new CookieOptions
            {
                Secure = true,
                HttpOnly = true,
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append(AuthConstants.REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
        }

        [HttpPost("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies[AuthConstants.REFRESH_TOKEN_COOKIE];
            if (refreshToken == null)
            {
                return BadRequest("Refresh token cookie not found");
            }

            try
            {
                var foundToken = await _refreshTokenService.RedeemRefreshToken(refreshToken);
                var jwtToken = _jwtService.generateJwt(foundToken.PartyId, foundToken.UserId, JwtRole.MapToJwtRole(foundToken.Role));
                await GenerateRefreshToken(foundToken.PartyId, foundToken.UserId, foundToken.Role);

                var response = new RefreshTokenResponse()
                {
                    Token = jwtToken
                };

                return Ok(response);

            } catch (TokenInvalidException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.INVALID_REFRESH_TOKEN));
            } catch (NotFoundException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_NOT_FOUND));
            } catch (PartyEndedException)
            {
                return BadRequest(new ErrorResponse(ErrorCodes.PARTY_ENDED));
            }
        }
    }
}
