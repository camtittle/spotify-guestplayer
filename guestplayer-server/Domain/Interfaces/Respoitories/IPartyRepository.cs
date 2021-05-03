using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Respoitories
{
    public interface IPartyRepository
    {
        public Task PutParty(Party party);
        public Task<Party> GetParty(string id);
        public Task UpdateParty(Party party);
        public Task PutTrackRequest(TrackRequest request);
    }
}
