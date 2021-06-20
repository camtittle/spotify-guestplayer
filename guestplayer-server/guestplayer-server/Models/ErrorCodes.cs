using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Models
{
    public class ErrorCodes
    {
        public const string TRACK_NOT_FOUND = "TrackNotFound";
        public const string ACTIVE_PLAYER_DEVICE_NOT_FOUND = "ActivePlayerDeviceNotFound";
        public const string INVALID_REFRESH_TOKEN = "InvalidRefreshToken";
        public const string PARTY_NOT_FOUND = "PartyNotFound";
        public const string PARTY_ENDED = "PartyEnded";
        public const string TOO_MANY_PENDING_REQUESTS = "TooManyPendingRequests";
    }
}
