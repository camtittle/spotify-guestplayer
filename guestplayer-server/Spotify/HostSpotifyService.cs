using Domain.Entities;
using Domain.Enums;
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
    public class HostSpotifyService : IHostSpotifyService
    {

        private readonly string USER_GRANT_TYPE = "authorization_code";
        private readonly string REFRESH_GRANT_TYPE = "refresh_token";

        private readonly ISpotifyAccountsClient _spotifyAccountsClient;
        private readonly ISpotifyClient _spotifyClient;
        private readonly SpotifyConfig _config;

        public HostSpotifyService(ISpotifyAccountsClient spotifyAccountsClient, ISpotifyClient spotifyClient, IOptions<SpotifyConfig> options)
        {
            _spotifyAccountsClient = spotifyAccountsClient;
            _spotifyClient = spotifyClient;
            _config = options.Value;
        }

        public async Task<SpotifyCredentials> GetAccessToken(string code)
        {
            var request = new GetAccessTokenRequest
            {
                Code = code,
                GrantType = USER_GRANT_TYPE,
                RedirectUri = _config.RedirectUri

            };

            try
            {
                var response = await _spotifyAccountsClient.GetAccessToken(request);

                var spotifyTokens = new SpotifyCredentials
                {
                    AccessToken = response.AccessToken,
                    RefreshToken = response.RefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddSeconds(response.ExpiresIn)
                };

                return spotifyTokens;
            } catch (ApiException ex)
            {
                var content = ex.Content;
                Console.WriteLine(ex);
                throw ex;
            }
        }

        public async Task<SpotifyCredentials> RefreshCredentials(SpotifyCredentials credentials)
        {
            var request = new RefreshAccessTokenRequest
            {
                GrantType = REFRESH_GRANT_TYPE,
                RefreshToken = credentials.RefreshToken

            };
            var response = await _spotifyAccountsClient.RefreshAccessToken(request);

            var spotifyTokens = new SpotifyCredentials
            {
                AccessToken = response.AccessToken,
                RefreshToken = credentials.RefreshToken,
                ExpiresAt = DateTime.UtcNow.AddSeconds(response.ExpiresIn)
            };

            return spotifyTokens;
        }

        public async Task PlayTrack(string trackId, PlayType type, SpotifyCredentials credentials)
        {
            var uri = $"spotify:track:{trackId}";

            try
            {
                switch (type)
                {
                    case PlayType.PlayNow:
                        var request = new PlayRequest()
                        {
                            Uris = new string[] { uri }
                        };
                        await _spotifyClient.Play(request, credentials.AccessToken);
                        break;
                    case PlayType.AddToQueue:
                        await _spotifyClient.Queue(uri, credentials.AccessToken);
                        break;
                }
            } catch (ApiException e)
            {
                if (e.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new ActivePlayerDeviceNotFound();
                }

                throw e;
            }
        }
    }
}
