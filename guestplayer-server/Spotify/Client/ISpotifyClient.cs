using Refit;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Spotify.Client
{
    public interface ISpotifyClient
    {
        [Get("/tracks/{id}")]
        public Task<TrackResponse> GetTrack(string id, [Authorize("Bearer")] string token);

        [Get("/search")]
        public Task<SearchResponse> SearchTracks(string q, string type, [Authorize("Bearer")] string token);
    }
}
