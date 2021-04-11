using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Respoitories
{
    public interface IPartyRepository
    {
        public Task Put(Party party);
    }
}
