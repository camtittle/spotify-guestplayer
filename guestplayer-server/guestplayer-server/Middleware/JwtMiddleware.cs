using Domain.Config;
using guestplayer_server.Helpers;
using guestplayer_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Helpers
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtService _jwtService;

        private const string HEADER_NAME = "Authorization";

        public JwtMiddleware(RequestDelegate next, JwtService jwtService)
        {
            _next = next;
            _jwtService = jwtService;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers[HEADER_NAME].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                AttachUserToContext(context, token);
            }

            await _next(context);
        }       

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var validatedToken = _jwtService.ValidateJwt(token);
                var userId = validatedToken.Claims.First(x => x.Type == JwtClaim.Sub).Value;
                var partyId = validatedToken.Claims.First(x => x.Type == JwtClaim.PartyId).Value;
                var role = validatedToken.Claims.First(x => x.Type == JwtClaim.Role).Value;

                context.Items[ContextItem.Role] = JwtRole.MapToRole(role);
                context.Items[ContextItem.PartyId] = partyId;
                context.Items[ContextItem.UserId] = userId;
            }
            catch
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
            }
        }
    }
}