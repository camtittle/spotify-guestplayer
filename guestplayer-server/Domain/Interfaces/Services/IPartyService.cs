﻿using Domain.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IPartyService
    {
        public Task<Party> CreateParty(CreatePartyParams partyParams);
    }
}
