using Domain.Config;
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
        private readonly AuthConfig _authConfig;

        private const string HEADER_NAME = "Authorization";

        public JwtMiddleware(RequestDelegate next, IOptions<AuthConfig> authConfig)
        {
            _next = next;
            _authConfig = authConfig.Value;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers[HEADER_NAME].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                attachUserToContext(context, token);
            }

            await _next(context);
        }       

        private void attachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_authConfig.Secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == JwtClaim.Sub).Value;
                var partyId = jwtToken.Claims.First(x => x.Type == JwtClaim.PartyId).Value;
                var role = jwtToken.Claims.First(x => x.Type == JwtClaim.Role).Value;

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