using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Config
{
    public class CosmosDbConfig
    {
        public const string SectionName = "CosmosDb";
        public string DatabaseName { get; set; }
        public string ContainerName { get; set; }
        public string Account { get; set; }
        public string Key { get; set; }

    }
}
