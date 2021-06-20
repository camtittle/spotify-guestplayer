using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IRefreshTokenService
    {
        Task<string> CreateRefreshToken(string partyId, string userId, Role role);
        Task<RefreshToken> RedeemRefreshToken(string token);
    }
}
