using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Options;
using Refit;
using Spotify.Client;
using Spotify.Client.Models;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Spotify
{
    class SpotifyService : ISpotifyService
    {

        private readonly string GRANT_TYPE = "authorization_code";

        private readonly ISpotifyClient _spotifyClient;
        private readonly SpotifyConfig _config;

        private string _accessToken;

        private const int ARTWORK_SIZE = 64;

        public SpotifyService(ISpotifyClient spotifyClient, IOptions<SpotifyConfig> options)
        {
            _spotifyClient = spotifyClient;
            _config = options.Value;
        }

        public void SetAccessToken(string token)
        {
            _accessToken = token;
        }

        public async Task<SpotifyCredentials> GetAccessToken(string code)
        {
            var request = new GetAccessTokenRequest
            {
                Code = code,
                GrantType = GRANT_TYPE,
                RedirectUri = _config.RedirectUri

            };
            var response = await _spotifyClient.GetAccessToken(request);

            var spotifyTokens = new SpotifyCredentials
            {
                AccessToken = response.AccessToken,
                RefreshToken = response.RefreshToken,
                ExpiresAt = DateTime.UtcNow.AddSeconds(response.ExpiresIn)
            };

            return spotifyTokens;
        }

        public async Task<Track> GetTrack(string id)
        {
            if (_accessToken == null)
            {
                throw new Exception("You must set access token first");
            }

            try
            {
                var track = await _spotifyClient.GetTrack(id, _accessToken);

                return new Track()
                {
                    Id = track.Id,
                    Title = track.Name,
                    DurationMs = track.DurationMs,
                    ArtworkUrl = track.Album.Images.Where(x => x.Height == ARTWORK_SIZE).FirstOrDefault().Url,
                    Artist = string.Join(", ", track.Artists.Select(x => x.Name)),
                    Album = track.Album.Name
                };

            } catch (ApiException ex)
            {
                if (ex.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new NotFoundException("Track not found");
                } else
                {
                    throw ex;
                }
            }
        }
    }
}
