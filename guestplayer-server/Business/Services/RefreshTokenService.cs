using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces.Respoitories;
using Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IPartyRepository _partyRepository;

        public RefreshTokenService(IPartyRepository partyRepository)
        {
            _partyRepository = partyRepository;
        }

        public async Task<string> CreateRefreshToken(string partyId, string userId, Role role)
        {
            var id = Guid.NewGuid().ToString();
            var token = $"{partyId}#{id}";
            var refreshToken = new RefreshToken()
            {
                Id = id,
                PartyId = partyId,
                UserId = userId,
                Token = token,
                Role = role,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                Type = ItemType.RefreshToken
            };

            await _partyRepository.PutRefreshToken(refreshToken);

            return refreshToken.Token;
        }

        public async Task<RefreshToken> RedeemRefreshToken(string token)
        {
            var parts = token.Split("#");
            if (parts.Length != 2)
            {
                throw new TokenInvalidException("Invalid refresh token format. Expected 2 parts.");
            }

            var partyId = parts[0];
            var id = parts[1];

            var refreshToken = await _partyRepository.GetRefreshToken(partyId, id);
            if (refreshToken == null)
            {
                throw new TokenInvalidException();
            }

            var party = await _partyRepository.GetParty(refreshToken.PartyId);
            if (party == null)
            {
                throw new NotFoundException("Party not found");
            }

            if (party.Ended)
            {
                throw new PartyEndedException();
            }

            // TODO check user expiry

            await _partyRepository.DeleteRefreshToken(partyId, id);

            return refreshToken;
        }
    }
}
