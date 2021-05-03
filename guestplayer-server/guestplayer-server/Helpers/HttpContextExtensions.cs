using guestplayer_server.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Helpers
{
    public static class HttpContextExtensions
    {
        public static string GetPartyId(this HttpContext context)
        {
            return (string)context.Items[ContextItem.PartyId];
        }

        public static string GetUserId(this HttpContext context)
        {
            return (string)context.Items[ContextItem.UserId];
        }
    }
}
