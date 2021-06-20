using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Party : BasePartyItem
    {
        public string Name { get; set; }
        public string OwnerUserId { get; set; }
        public int GuestCount { get; set; }
        public string CohostJoinToken { get; set; }
        public List<string> Cohosts { get; set; }
        public SpotifyCredentials SpotifyCredentials { get; set; }

        public bool Ended
        {
            get { return DeletedAt != null; }
        }
    }
}
