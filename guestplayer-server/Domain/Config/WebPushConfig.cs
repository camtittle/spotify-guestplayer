using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Config
{
    public class WebPushConfig
    {
        public const string SectionName = "WebPush";
        public string PublicKey { get; set; }
        public string PrivateKey { get; set; }
    }
}
