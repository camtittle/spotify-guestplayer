using Refit;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Spotify.Client.Models
{
    class GetAccessTokenRequest
    {
        [AliasAs("grant_type")]
        public string GrantType { get; set; }

        [AliasAs("code")]
        public string Code { get; set; }

        [AliasAs("redirect_uri")]
        public string RedirectUri { get; set; }
    }
}
