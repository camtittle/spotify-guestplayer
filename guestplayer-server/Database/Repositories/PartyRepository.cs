using Domain.Config;
using Domain.Entities;
using Domain.Interfaces.Respoitories;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Database.Repositories
{
    public class PartyRepository : IPartyRepository
    {

        private readonly CosmosClient _cosmosClient;
        private Container _container;
        private readonly CosmosDbConfig _config;

        public PartyRepository(CosmosClient cosmosClient, IOptions<CosmosDbConfig> config)
        {
            _cosmosClient = cosmosClient;
            _config = config.Value;
            _container = _cosmosClient.GetContainer(_config.DatabaseName, _config.ContainerName);
        }


        public async Task Put(Party party)
        {
            await _container.CreateItemAsync<Party>(party, new PartitionKey(party.Id));
        }
    }
}
