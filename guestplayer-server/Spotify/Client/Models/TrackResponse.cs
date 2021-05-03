using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Spotify.Client.Models
{
    public class TrackResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("duration_ms")]
        public int DurationMs { get; set; }

        [JsonPropertyName("artists")]
        public ArtistResponse[] Artists { get; set; }

        [JsonPropertyName("album")]
        public AlbumResponse Album { get; set; }
    }

    public class ArtistResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }
    }

    public class AlbumResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("images")]
        public AlbumImageResponse[] Images { get; set; }
    }
    public class AlbumImageResponse
    {
        [JsonPropertyName("height")]
        public int Height { get; set; }

        [JsonPropertyName("width")]
        public int Width { get; set; }

        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
