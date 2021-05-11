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
    public class HostSpotifyService : IHostSpotifyService
    {

        private readonly string USER_GRANT_TYPE = "authorization_code";

        private readonly ISpotifyAccountsClient _spotifyAccountsClient;
        private readonly SpotifyConfig _config;

        private string _accessToken;

        public HostSpotifyService(ISpotifyAccountsClient spotifyClient, IOptions<SpotifyConfig> options)
        {
            _spotifyAccountsClient = spotifyClient;
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
                GrantType = USER_GRANT_TYPE,
                RedirectUri = _config.RedirectUri

            };
            var response = await _spotifyAccountsClient.GetAccessToken(request);

            var spotifyTokens = new SpotifyCredentials
            {
                AccessToken = response.AccessToken,
                RefreshToken = response.RefreshToken,
                ExpiresAt = DateTime.UtcNow.AddSeconds(response.ExpiresIn)
            };

            return spotifyTokens;
        }
    }
}
