using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DTOs
{
    public class CreatePartyParams
    {
        public string PartyName { get; set; }
        public SpotifyCredentials SpotifyCredentials { get; set; }
    }
}
