using Refit;
using System;
using System.Collections.Generic;
using System.Text;

namespace Spotify.Client.Models
{
    public class RefreshAccessTokenRequest
    {
        [AliasAs("refresh_token")]
        public string RefreshToken { get; set; }

        [AliasAs("grant_type")]
        public string GrantType { get; set; }
    }
}
