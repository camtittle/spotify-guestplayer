using Domain.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces.Respoitories;
using Domain.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public class TrackRequestService : ITrackRequestService
    {
        private readonly IGuestSpotifyService _guestSpotifyService;
        private readonly IHostSpotifyService _hostSpotifyService;
        private readonly IPartyRepository _partyRepository;
        private readonly IWebsocketService _websocketService;
        private readonly IPushNotificationService _pushNotificationService;

        public TrackRequestService(IGuestSpotifyService spotifyService, IHostSpotifyService hostSpotifyService, IPartyRepository partyRepository, IWebsocketService websocketService, IPushNotificationService pushNotificationService)
        {
            _guestSpotifyService = spotifyService;
            _hostSpotifyService = hostSpotifyService;
            _partyRepository = partyRepository;
            _websocketService = websocketService;
            _pushNotificationService = pushNotificationService;

        }

        private async Task SendTrackRequestPushNotifications(Party party, TrackRequest trackRequest)
        {
            var usersToNotify = new List<User>(party.Cohosts)
            {
                party.Host
            };
            var subscriptions = usersToNotify.Select(x => x.PushSubscription).Where(x => x != null);

            var tasks = subscriptions.Select(async (subscription) =>
            {
                var sendParams = new SendPushParams<TrackRequest>()
                {
                    PushSubscription = subscription,
                    Type = PushNotificationType.TrackRequest,
                    Data = trackRequest
                };

                try
                {
                    await _pushNotificationService.Send(sendParams);
                } catch (Exception e)
                {
                    // Silently swallow error as we dont want failing push notifs to make the HTTP request error
                    Console.WriteLine(e.ToString());
                }
            });

            await Task.WhenAll(tasks);
        }

        public async Task<TrackRequest> CreateTrackRequest(CreateTrackRequestParams createParams)
        {
            if (createParams.SpotifyTrackId == null)
            {
                throw new ArgumentNullException(nameof(createParams.SpotifyTrackId));
            }

            var track = await _guestSpotifyService.GetTrack(createParams.SpotifyTrackId);

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
                Album = track.Album,
                CreatedAt = DateTime.UtcNow,
                DeletedAt = null,
                AcceptedAt = null
            };

            await Task.WhenAll(new Task[]
            {
                _partyRepository.PutTrackRequest(trackRequest),
                _websocketService.NotifyAdminOfTrackRequest(trackRequest),
                SendTrackRequestPushNotifications(createParams.Party, trackRequest)
            });

            return trackRequest;
        }

        public async Task<TrackRequest[]> GetTrackRequests(string partyId)
        {
            if (partyId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            return await _partyRepository.GetTrackRequests(partyId);
        }

        public async Task<int> GetTrackRequestCount(string partyId)
        {
            if (partyId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            return await _partyRepository.GetTrackRequestCount(partyId);
        }

        public async Task<TrackRequest[]> GetPendingTrackRequestsForUser(string partyId, string userId)
        {
            if (partyId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            if (userId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            return await _partyRepository.GetPendingTrackRequestsForUser(partyId, userId);
        }

        public async Task DeleteTrackRequest(string partyId, string requestId)
        {
            if (partyId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            if (requestId == null)
            {
                throw new ArgumentNullException(nameof(requestId));
            }


            var trackRequest = await _partyRepository.GetTrackRequest(partyId, requestId);
            if (trackRequest == null)
            {
                throw new NotFoundException();
            }

            trackRequest.DeletedAt = DateTime.UtcNow;
            await _partyRepository.PutTrackRequest(trackRequest);
        }

        private async Task<SpotifyCredentials> RefreshSpotifyCredentials(string partyId, SpotifyCredentials credentials)
        {
            if (credentials.Expired())
            {
                var refreshedCredentials = await _hostSpotifyService.RefreshCredentials(credentials);
                var party = await _partyRepository.GetParty(partyId);
                party.SpotifyCredentials = refreshedCredentials;
                await _partyRepository.PutParty(party);
                return refreshedCredentials;
            }

            return credentials;
        }

        public async Task AcceptTrackRequest(string partyId, string requestId, PlayType type)
        {
            if (partyId == null)
            {
                throw new ArgumentNullException(nameof(partyId));
            }

            if (requestId == null)
            {
                throw new ArgumentNullException(nameof(requestId));
            }

            var trackRequest = await _partyRepository.GetTrackRequest(partyId, requestId);
            if (trackRequest == null)
            {
                throw new NotFoundException();
            }

            var party = await _partyRepository.GetParty(partyId);
            if (party == null)
            {
                throw new NotFoundException();
            }

            var credentials = await RefreshSpotifyCredentials(partyId, party.SpotifyCredentials);
            await _hostSpotifyService.PlayTrack(trackRequest.SpotifyTrackId, type, credentials);

            trackRequest.AcceptedAt = DateTime.UtcNow;
            await _partyRepository.PutTrackRequest(trackRequest);
        }
    }
}
