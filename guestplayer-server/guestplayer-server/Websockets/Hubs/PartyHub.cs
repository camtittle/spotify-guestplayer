using Domain.Enums;
using guestplayer_server.Helpers;
using guestplayer_server.Models;
using guestplayer_server.Websockets.Helpers;
using guestplayer_server.Websockets.Hubs.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Websockets.Hubs
{
    public class PartyHub : Hub<IPartyHub>
    {
        private readonly JwtService _jwtService;

        public PartyHub(JwtService jwtService)
        {
            _jwtService = jwtService;
        }

        public async Task Authorize(string token)
        {
            try
            {
                var validatedToken = _jwtService.ValidateJwt(token);
                var userId = validatedToken.Claims.First(x => x.Type == JwtClaim.Sub).Value;
                var partyId = validatedToken.Claims.First(x => x.Type == JwtClaim.PartyId).Value;
                var role = JwtRole.MapToRole(validatedToken.Claims.First(x => x.Type == JwtClaim.Role).Value);

                if (role == Role.Host && partyId != null)
                {
                    var groupName = GroupsHelper.GetPartyAdminGroupName(partyId);
                    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                }
            }
            catch
            {
                // do nothing if not authenticated
            }
        }
    }
}
