using Refit;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Spotify.Client
{
    public interface ISpotifyAccountsClient
    {
        [Post("/token")]
        public Task<GetAccessTokenResponse> GetAccessToken([Body(BodySerializationMethod.UrlEncoded)] GetAccessTokenRequest request);


        [Post("/token")]
        public Task<RefreshAccessTokenResponse> RefreshAccessToken([Body(BodySerializationMethod.UrlEncoded)] RefreshAccessTokenRequest request);
    }
}
