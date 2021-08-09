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
        private readonly IWebsocketService _websocketService;

        public PartyService(IPartyRepository partyRepository, IWebsocketService websocketService)
        {
            _partyRepository = partyRepository;
            _websocketService = websocketService;
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
                CohostJoinToken = Guid.NewGuid().ToString(),
                Host = new User()
                {
                    UserId = partyParams.HostUserId,
                    PushSubscription = null
                },
                Cohosts = new List<User>(),
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            await _partyRepository.PutParty(party);

            return party;
        }

        public async Task EndParty(string partyId)
        {
            var party = await GetParty(partyId);

            if (party == null)
            {
                throw new NotFoundException();
            }

            party.DeletedAt = DateTime.UtcNow;

            await Task.WhenAll(new []
            {
                _partyRepository.PutParty(party),
                _partyRepository.HardDeleteAllTrackRequests(partyId),
                _websocketService.Disconnect(partyId)
            });
        }

        public async Task<Party> GetParty(string id)
        {
            var party = await _partyRepository.GetParty(id);

            return party;
        }

        public async Task<Party> JoinParty(string id)
        {
            var party = await GetParty(id);

            if (party == null || party.Ended)
            {
                throw new NotFoundException();
            }

            party.GuestCount++;
            await _partyRepository.UpdateParty(party);

            return party;
        }

        public async Task LeaveParty(string userId, Party party)
        {
            var cohostIndex = party.Cohosts.FindIndex(x => x.UserId == userId);
            if (cohostIndex > -1)
            {
                party.Cohosts.RemoveAt(cohostIndex);
            }

            else if (party.GuestCount > 0)
            {
                party.GuestCount--;
            }

            await _partyRepository.PutParty(party);
        }

        public async Task<Party> AddCohost(string partyId, string userId, string joinToken)
        {
            var party = await GetParty(partyId);

            if (party == null)
            {
                throw new NotFoundException();
            }

            if (party.Ended)
            {
                throw new PartyEndedException();
            }

            if (party.CohostJoinToken != joinToken)
            {
                throw new TokenInvalidException();
            }

            party.Cohosts.Add(new User() {
                UserId = userId,
                PushSubscription = null
            });
            await _partyRepository.PutParty(party);

            return party;
        }
    }
}
