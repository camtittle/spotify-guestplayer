using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class AuthorizationException : Exception
{
    public AuthorizationException()
    {
    }

    public AuthorizationException(string message)
        : base(message)
    {
    }

    public AuthorizationException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
}
