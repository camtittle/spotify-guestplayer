using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class SpotifyCredentials
    {
        public string AccessToken { get; set; }

        public int ExpiresIn { get; set; }

        public string RefreshToken { get; set; }
    }
}
