using Domain.DTOs;
using Domain.Entities;
using Domain.Interfaces.Respoitories;
using Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public class PartyService : IPartyService
    {
        private readonly IPartyRepository _partyRepository;

        public PartyService(IPartyRepository partyRepository)
        {
            _partyRepository = partyRepository;
        }

        public async Task<Party> CreateParty(CreatePartyParams partyParams)
        {
            // TODO
            var party = new Party
            {
                Id = Guid.NewGuid().ToString(),
                Name = partyParams.PartyName
            };

            await _partyRepository.Put(party);

            return party;
        }
    }
}
