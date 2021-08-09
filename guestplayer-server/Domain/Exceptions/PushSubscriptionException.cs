using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class PushSubscriptionException : Exception
    {
        public PushSubscriptionException()
        {
        }

        public PushSubscriptionException(string message)
            : base(message)
        {
        }

        public PushSubscriptionException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
