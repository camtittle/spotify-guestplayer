using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class RegisterForPushNotificationsRequest
    {
        [Required]
        public Subscription Subscription { get; set; }
    }

    public class Subscription
    {
        [Required]
        public string Endpoint { get; set; }

        [Required]
        public Keys Keys { get; set; }

    }

    public class Keys
    {
        [Required]
        public string Auth { get; set; }
        [Required]
        public string P256dh { get; set; }
    }
}
