using System;
using System.Collections.Generic;
using System.Text;

namespace Spotify.Client.Models
{
    public class SpotifyConfig
    {
        public const string SectionName = "Spotify";

        public string ClientId { get; set; }
        public string Secret { get; set; }
        public string ApiBaseUrl { get; set; }
        public string RedirectUri { get; set; }
    }
}
