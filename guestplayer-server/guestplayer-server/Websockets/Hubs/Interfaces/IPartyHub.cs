using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace guestplayer_server.Websockets.Hubs.Interfaces
{
    public interface IPartyHub
    {
        public Task ReceiveTrackRequest(TrackRequest request);
        public Task Disconnect();
    }
}
