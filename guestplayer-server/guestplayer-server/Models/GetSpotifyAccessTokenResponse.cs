﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class GetSpotifyAccessTokenResponse
    {
        public string AccessToken { get; set; }

        public int ExpiresIn { get; set; }

        public string RefreshToken { get; set; }
    }
}
