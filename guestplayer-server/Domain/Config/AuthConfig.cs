using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Config
{
    public class AuthConfig
    {
        public const string SectionName = "Auth";

        public string Secret { get; set; }
    }
}
