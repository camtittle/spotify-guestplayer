using Domain.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IPartyService
    {
        public Task<Party> CreateParty(CreatePartyParams partyParams);
        public Task<Party> GetParty(string id);
        public Task<Party> JoinParty(string id);
        public Task EndParty(string id);
        public Task LeaveParty(string userId, Party party);
        public Task<Party> AddCohost(string partyId, string userId, string joinToken);
    }
}
