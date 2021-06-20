using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class TokenInvalidException : Exception
    {
        public TokenInvalidException()
        {
        }

        public TokenInvalidException(string message)
            : base(message)
        {
        }

        public TokenInvalidException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
