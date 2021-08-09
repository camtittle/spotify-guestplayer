using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Party : BasePartyItem
    {
        public string Name { get; set; }
        public User Host { get; set; }
        public List<User> Cohosts { get; set; }
        public int GuestCount { get; set; }
        public string CohostJoinToken { get; set; }
        public SpotifyCredentials SpotifyCredentials { get; set; }
        public List<string> PushNotificationSubscriptions { get; set; }
        public bool Ended
        {
            get { return DeletedAt != null; }
        }
    }
}
