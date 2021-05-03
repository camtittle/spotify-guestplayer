using Domain.Enums;
using Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public static class JwtRole
    {
        public const string HOST = "Host";
        public const string GUEST = "Guest";

        public static Role MapToRole(string jwtRole)
        {
            switch (jwtRole)
            {
                case HOST:
                    return Role.Host;
                case GUEST:
                    return Role.Guest;
                default:
                    throw new AuthorizationException($"Invalid role found: {jwtRole}");
            }
        }
    }
}
