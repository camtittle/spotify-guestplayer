using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class PartyResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int GuestCount { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
