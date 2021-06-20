using Domain.DTOs;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ITrackRequestService
    {
        public Task<TrackRequest> CreateTrackRequest(CreateTrackRequestParams createParams);
        public Task<TrackRequest[]> GetTrackRequests(string partyId);
        public Task<int> GetTrackRequestCount(string partyId);
        public Task<TrackRequest[]> GetPendingTrackRequestsForUser(string partyId, string userId);
        public Task DeleteTrackRequest(string partyId, string requestId);
        public Task AcceptTrackRequest(string partyId, string requestId, PlayType type);
    }
}
