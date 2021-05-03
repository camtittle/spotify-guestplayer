using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class BasePartyItem
    {
        public string Id { get; set; }
        public string PartyId { get; set; }
        public ItemType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
