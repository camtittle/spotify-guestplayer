using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Exceptions
{
    public class ActivePlayerDeviceNotFound : Exception
    {
        public ActivePlayerDeviceNotFound()
        {
        }

        public ActivePlayerDeviceNotFound(string message)
            : base(message)
        {
        }

        public ActivePlayerDeviceNotFound(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
