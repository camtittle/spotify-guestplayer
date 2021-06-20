using Domain.Config;
using guestplayer_server.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace guestplayer_server.Helpers
{
    public class JwtService
    {
        private readonly AuthConfig _authConfig;

        private const int EXPIRY_HOURS = 1;

        public JwtService(IOptions<AuthConfig> authConfig)
        {
            _authConfig = authConfig.Value;
        }

        public string generateJwt(string partyId, string userId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authConfig.Secret);
            var claims = new[] { 
                new Claim(JwtClaim.Sub, userId),
                new Claim(JwtClaim.PartyId, partyId),
                new Claim(JwtClaim.Role, role),
            };
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(EXPIRY_HOURS),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        internal object generateJwt(string partyId, string userId, object role)
        {
            throw new NotImplementedException();
        }

        public JwtSecurityToken ValidateJwt(string token)
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

            return (JwtSecurityToken)validatedToken;
        }
    }
}
