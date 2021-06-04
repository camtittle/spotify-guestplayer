using Domain.Entities;
using Domain.Interfaces.Services;
using guestplayer_server.Websockets.Helpers;
using guestplayer_server.Websockets.Hubs;
using guestplayer_server.Websockets.Hubs.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Websockets.Services
{
    public class WebsocketService : IWebsocketService
    {
        private readonly IHubContext<PartyHub, IPartyHub> _hubContext;

        public WebsocketService(IHubContext<PartyHub, IPartyHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task Disconnect(string partyId)
        {
            var partyAdminGroup = GroupsHelper.GetPartyAdminGroupName(partyId);
            await _hubContext.Clients.Group(partyAdminGroup).Disconnect();
        }

        public async Task NotifyAdminOfTrackRequest(TrackRequest request)
        {
            var partyAdminGroup = GroupsHelper.GetPartyAdminGroupName(request.PartyId);
            await _hubContext.Clients.Group(partyAdminGroup).ReceiveTrackRequest(request);
        }
    }
}
