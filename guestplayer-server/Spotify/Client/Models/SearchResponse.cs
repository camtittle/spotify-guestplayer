using System.Text.Json.Serialization;

using System;
using System.Collections.Generic;
using System.Text;

namespace Spotify.Client.Models
{
    public class SearchResponse
    {
        [JsonPropertyName("tracks")]
        public TrackSearchResponse Tracks { get; set; }
    }

    public class TrackSearchResponse
    {
        [JsonPropertyName("items")]
        public TrackResponse[] Items { get; set; }

    }
}
