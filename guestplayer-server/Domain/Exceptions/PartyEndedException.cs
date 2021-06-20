using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class PartyEndedException : Exception
    {
        public PartyEndedException()
        {
        }

        public PartyEndedException(string message)
            : base(message)
        {
        }

        public PartyEndedException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
