using Refit;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Spotify.Client
{
    interface ISpotifyClient
    {
        [Post("/token")]
        Task<GetAccessTokenResponse> GetAccessToken([Body(BodySerializationMethod.UrlEncoded)] GetAccessTokenRequest request);


        [Get("/tracks/{id}")]
        Task<TrackResponse> GetTrack(string id, [Authorize("Bearer")] string token);
    }
}
