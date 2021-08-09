using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class PushSubscriptionNotFoundException : Exception
    {
        public PushSubscriptionNotFoundException()
        {
        }

        public PushSubscriptionNotFoundException(string message)
            : base(message)
        {
        }

        public PushSubscriptionNotFoundException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
