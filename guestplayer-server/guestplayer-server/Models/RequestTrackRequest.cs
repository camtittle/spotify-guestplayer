using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class RequestTrackRequest
    {
        [Required]
        public string TrackId { get; set; }
    }
}
