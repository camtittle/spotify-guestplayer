using Domain.Config;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces.Respoitories;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
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
            await _container.UpsertItemAsync<Party>(party, new PartitionKey(party.PartyId));
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
            await _container.UpsertItemAsync<TrackRequest>(request, new PartitionKey(request.PartyId));
        }

        public async Task<TrackRequest> GetTrackRequest(string partyId, string requestId)
        {
            TrackRequest request = null;

            QueryDefinition queryDefinition = new QueryDefinition($"select * from {_config.ContainerName} p where p.id = @requestId and IS_NULL(p.deletedAt)")
                .WithParameter("@requestId", requestId);

            using FeedIterator<TrackRequest> feedIterator = _container.GetItemQueryIterator<TrackRequest>(
                queryDefinition,
                null,
                new QueryRequestOptions() { PartitionKey = new PartitionKey(partyId) });

            while (feedIterator.HasMoreResults)
            {
                var items = await feedIterator.ReadNextAsync();
                request = items.FirstOrDefault();
            }

            return request;
        }

        public async Task<TrackRequest[]> GetTrackRequests(string partyId, bool includeDeleted = false)
        {
            var query = $"select * from {_config.ContainerName} p where p.type = @request";
            if (!includeDeleted)
            {
                query += " and IS_NULL(p.deletedAt) and IS_NULL(p.acceptedAt)";
            }

            List<TrackRequest> requests = new List<TrackRequest>();

            QueryDefinition queryDefinition = new QueryDefinition(query)
                .WithParameter("@request", ItemType.Request);

            using FeedIterator<TrackRequest> feedIterator = _container.GetItemQueryIterator<TrackRequest>(
                queryDefinition,
                null,
                new QueryRequestOptions() { PartitionKey = new PartitionKey(partyId) });

            while (feedIterator.HasMoreResults)
            {
                foreach (var item in await feedIterator.ReadNextAsync())
                {
                    requests.Add(item);
                }
            }

            return requests.ToArray();
        }

        public async Task<int> GetTrackRequestCount(string partyId)
        {
            var count = 0;

            var query = $"select VALUE COUNT(0) from {_config.ContainerName} p where p.type = @request and IS_NULL(p.deletedAt) and IS_NULL(p.acceptedAt)";

            QueryDefinition queryDefinition = new QueryDefinition(query)
                .WithParameter("@request", ItemType.Request);

            using FeedIterator<int> feedIterator = _container.GetItemQueryIterator<int>(
                queryDefinition,
                null,
                new QueryRequestOptions() { PartitionKey = new PartitionKey(partyId) });

            if (feedIterator.HasMoreResults)
            {
                count = (await feedIterator.ReadNextAsync()).FirstOrDefault();
            }

            return count;
        }

        // Hard delete, not soft delete. Use with caution
        public async Task HardDeleteAllTrackRequests(string partyId)
        {
            var requests = await GetTrackRequests(partyId, true);

            // doing them sequentially to avoid hitting rate limit
            foreach (var request in requests)
            {
                await _container.DeleteItemAsync<TrackRequest>(request.Id, new PartitionKey(request.PartyId));
            }
        }
    }
}
