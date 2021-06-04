using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class TrackRequestResponse
    {
        public string Id { get; set; }
        public string SpotifyTrackId { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string ArtworkUrl { get; set; }
        public string Album { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
