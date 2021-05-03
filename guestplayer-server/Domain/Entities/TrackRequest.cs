using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class TrackRequest : BasePartyItem
    {
        public string SpotifyTrackId { get; set; }
        public string UserId { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string ArtworkUrl { get; set; }
        public string Album { get; set; }
    }
}
