using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Spotify.Client.Models
{
    class GetClientCredentialsResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
