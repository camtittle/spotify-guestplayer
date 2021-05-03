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


        public async Task PutParty(Party party)
        {
            party.LastUpdated = DateTime.UtcNow;
            await _container.CreateItemAsync<Party>(party, new PartitionKey(party.PartyId));
        }

        public async Task<Party> GetParty(string id)
        {
            try
            {
                ItemResponse<Party> response = await _container.ReadItemAsync<Party>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }

        }

        public async Task UpdateParty(Party party)
        {
            party.LastUpdated = DateTime.UtcNow;
            await _container.UpsertItemAsync<Party>(party, new PartitionKey(party.PartyId));
        }

        public async Task PutTrackRequest(TrackRequest request)
        {
            request.LastUpdated = DateTime.UtcNow;
            await _container.CreateItemAsync<TrackRequest>(request, new PartitionKey(request.PartyId));
        }
    }
}
