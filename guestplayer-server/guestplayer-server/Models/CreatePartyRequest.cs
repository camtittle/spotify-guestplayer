using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class SpotifyCredentials
    {
        [Required]
        public string AccessToken { get; set; }

        [Required]
        public string RefreshToken { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }
    }

    public class CreatePartyRequest
    {
        [Required]
        public SpotifyCredentials SpotifyCredentials { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
