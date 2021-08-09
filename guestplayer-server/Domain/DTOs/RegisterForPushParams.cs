using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DTOs
{
    public class RegisterForPushParams
    {
        public string UserId { get; set; }
        public string PartyId { get; set; }
        public string Endpoint { get; set; }
        public string Auth { get; set; }
        public string P256dh { get; set; }
    }
}
