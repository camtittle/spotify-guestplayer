using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class User
    {
        public string UserId { get; set; }
        public PushSubscription PushSubscription { get; set; }
    }
}
