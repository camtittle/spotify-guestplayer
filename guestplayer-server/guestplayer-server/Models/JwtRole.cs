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
        public const string COHOST = "Cohost";

        public static Role MapToRole(string jwtRole)
        {
            switch (jwtRole)
            {
                case HOST:
                    return Role.Host;
                case GUEST:
                    return Role.Guest;
                case COHOST:
                    return Role.Cohost;
                default:
                    throw new AuthorizationException($"Invalid role found: {jwtRole}");
            }
        }

        public static string MapToJwtRole(Role role)
        {
            switch (role)
            {
                case Role.Guest:
                    return GUEST;
                case Role.Host:
                    return HOST;
                case Role.Cohost:
                    return COHOST;
                default:
                    throw new AuthorizationException($"Invalid role found: {role}");
            }
        }
    }
}
