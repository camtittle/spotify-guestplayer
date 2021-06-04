using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Spotify.Client.Models
{
    public class PlayRequest
    {
        [JsonPropertyName("uris")]
        public string[] Uris { get; set; }
    }
}
