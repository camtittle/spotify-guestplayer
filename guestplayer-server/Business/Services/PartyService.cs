using Domain.DTOs;
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
    public class PartyService : IPartyService
    {
        private readonly IPartyRepository _partyRepository;

        public PartyService(IPartyRepository partyRepository)
        {
            _partyRepository = partyRepository;
        }

        public async Task<Party> CreateParty(CreatePartyParams partyParams)
        {
            var id = Guid.NewGuid().ToString();
            var party = new Party
            {
                Id = id,
                Type = ItemType.Party,
                PartyId = id,
                Name = partyParams.PartyName,
                GuestCount = 0,
                SpotifyCredentials = partyParams.SpotifyCredentials,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            await _partyRepository.PutParty(party);

            return party;
        }

        public async Task<Party> GetParty(string id)
        {
            var party = await _partyRepository.GetParty(id);

            return party;
        }

        public async Task<Party> JoinParty(string id)
        {
            var party = await GetParty(id);

            if (party == null)
            {
                throw new NotFoundException();
            }

            party.GuestCount++;
            await _partyRepository.UpdateParty(party);

            return party;
        }
    }
}
