using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class ErrorResponse
    {
        public string ErrorCode { get; set; }

        public ErrorResponse(string errorCode)
        {
            ErrorCode = errorCode;
        }
    }
}
