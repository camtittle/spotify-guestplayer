using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Options;
using Refit;
using Spotify.Client;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Spotify
{
    public class GuestSpotifyService : IGuestSpotifyService
    {
        private readonly string GRANT_TYPE = "client_credentials";

        private readonly ISpotifyClient _spotifyClient;
        private readonly ISpotifyAccountsClient _spotifyAccountsClient;
        private readonly SpotifyConfig _config;

        private string _accessToken;
        private DateTime _accessTokenExpiresAt;

        private const int ARTWORK_SIZE = 64;
        private const string SEARCH_TYPE = "track";

        public GuestSpotifyService(ISpotifyClient spotifyClient, ISpotifyAccountsClient spotifyAccountsClient, IOptions<SpotifyConfig> options)
        {
            _spotifyClient = spotifyClient;
            _spotifyAccountsClient = spotifyAccountsClient;
            _config = options.Value;
        }

        async Task RefreshAccessToken()
        {
            var request = new GetAccessTokenRequest
            {
                GrantType = GRANT_TYPE
            };
            var response = await _spotifyAccountsClient.GetAccessToken(request);

            _accessToken = response.AccessToken;
            _accessTokenExpiresAt = DateTime.UtcNow.AddSeconds(response.ExpiresIn);
        }

        async Task<string> GetAccessToken()
        {
            if (_accessToken == null || _accessTokenExpiresAt < DateTime.UtcNow)
            {
                await RefreshAccessToken();
            }

            return _accessToken;
        }

        Track MapTrackResponse(TrackResponse trackResponse)
        {
            return new Track()
            {
                Id = trackResponse.Id,
                Title = trackResponse.Name,
                DurationMs = trackResponse.DurationMs,
                ArtworkUrl = trackResponse.Album.Images.Where(x => x.Height == ARTWORK_SIZE).FirstOrDefault().Url,
                Artist = string.Join(", ", trackResponse.Artists.Select(x => x.Name)),
                Album = trackResponse.Album.Name
            };
        }

        public async Task<Track> GetTrack(string id)
        {
            var token = await GetAccessToken();

            try
            {
                var track = await _spotifyClient.GetTrack(id, token);

                return MapTrackResponse(track);

            }
            catch (ApiException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new NotFoundException("Track not found");
                }
                else
                {
                    throw ex;
                }
            }
        }

        public async Task<Track[]> SearchTracks(string term)
        {
            var token = await GetAccessToken();
            var results = await _spotifyClient.SearchTracks(term, SEARCH_TYPE, token);

            return results.Tracks.Items.Select(track => MapTrackResponse(track)).ToArray();
        }
    }
}
