using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DTOs
{
    public class SendPushParams<TData>
    {
        public PushSubscription PushSubscription { get; set; }
        public string Type { get; set; }
        public TData Data { get; set; }
    }

    public class PushNotificationType
    {
        public static string TrackRequest = "TrackRequest";
    }
}
