using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Websockets.Helpers
{
    public static class GroupsHelper
    {
        public static string GetPartyAdminGroupName(string partyId)
        {
            return "PartyAdmin#" + partyId;
        }
    }
}
