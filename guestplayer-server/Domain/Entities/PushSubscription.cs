using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PushSubscription
    {
        public string UserId { get; set; }
        public string Endpoint { get; set; }
        public Keys Keys { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }

    }

    public class Keys
    {
        public string Auth { get; set; }
        public string P256dh { get; set; }
    }
}
