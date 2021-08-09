using System;
using System.Collections.Generic;
using System.Text;

namespace Push.Models
{
    class PushNotification<TData>
    {
        public string Type { get; set; }
        public TData Data { get; set; }
    }
}
