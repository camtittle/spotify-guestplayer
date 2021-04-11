using Domain.Entities;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Options;
using Spotify.Client;
using Spotify.Client.Models;
using System;
using System.Threading.Tasks;

namespace Spotify
{
    class SpotifyService : ISpotifyService
    {

        private readonly string GRANT_TYPE = "authorization_code";

        private readonly ISpotifyClient _spotifyClient;
        private readonly SpotifyConfig _config;

        public SpotifyService(ISpotifyClient SpotifyClient, IOptions<SpotifyConfig> options)
        {
            _spotifyClient = SpotifyClient;
            _config = options.Value;
        }

        public async Task<SpotifyCredentials> getAccessToken(string code)
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
                ExpiresIn = response.ExpiresIn,
                RefreshToken = response.RefreshToken
            };

            return spotifyTokens;
        }
    }
}
