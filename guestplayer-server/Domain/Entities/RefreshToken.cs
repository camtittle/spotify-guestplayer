using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class RefreshToken : BasePartyItem
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public Role Role { get; set; }
    }
}
