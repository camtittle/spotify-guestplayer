using Domain.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces.Respoitories;
using Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public class TrackRequestService : ITrackRequestService
    {
        private readonly IGuestSpotifyService _spotifyService;
        private readonly IPartyRepository _partyRepository;

        public TrackRequestService(IGuestSpotifyService spotifyService, IPartyRepository partyRepository)
        {
            _spotifyService = spotifyService;
            _partyRepository = partyRepository;
        }

        public async Task<TrackRequest> CreateTrackRequest(CreateTrackRequestParams createParams)
        {
            if (createParams.SpotifyTrackId == null)
            {
                throw new ArgumentNullException(nameof(createParams.SpotifyTrackId));
            }

            var track = await _spotifyService.GetTrack(createParams.SpotifyTrackId);

            var trackRequest = new TrackRequest()
            {
                Type =  ItemType.Request,
                Id = Guid.NewGuid().ToString(),
                PartyId = createParams.Party.PartyId,
                UserId = createParams.UserId,
                SpotifyTrackId = track.Id,
                Title = track.Title,
                Artist = track.Artist,
                ArtworkUrl = track.ArtworkUrl,
                Album = track.Album
            };

            await _partyRepository.PutTrackRequest(trackRequest);

            return trackRequest;
        }
    }
}
