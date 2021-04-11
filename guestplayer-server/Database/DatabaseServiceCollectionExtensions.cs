using Database.Repositories;
using Domain.Config;
using Domain.Interfaces.Respoitories;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Database
{
    public static class DatabaseServiceCollectionExtensions
    {

        public static void AddRepositories(this IServiceCollection services, IConfiguration configuration)
        {
            AddCosmosDbClient(services, configuration);

            services.AddScoped<IPartyRepository, PartyRepository>();
        }

        private static void AddCosmosDbClient(IServiceCollection services, IConfiguration configuration)
        {
            var configSection = configuration.GetSection(CosmosDbConfig.SectionName);
            var config = configSection.Get<CosmosDbConfig>();
            services.Configure<CosmosDbConfig>(configSection);

            CosmosClient client = new CosmosClient(config.Account, config.Key, new CosmosClientOptions()
            {
                SerializerOptions = new CosmosSerializationOptions()
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }

            });
            services.AddSingleton<CosmosClient>(client);
        }
    }
}
