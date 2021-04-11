using Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Refit;
using Spotify.Client;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Spotify
{
    public static class SpotifyServiceCollectionExtensions
    {
        public static void AddSpotifyClient(this IServiceCollection services, IConfiguration configuration)
        {
            var configSection = configuration.GetSection(SpotifyConfig.SectionName);
            var config = configSection.Get<SpotifyConfig>();
            services.Configure<SpotifyConfig>(configSection);
            services.AddTransient<AuthHeaderHandler>();

            services.AddRefitClient<ISpotifyClient>()
                .ConfigureHttpClient(c => c.BaseAddress = new Uri(config.ApiBaseUrl))
                .AddHttpMessageHandler<AuthHeaderHandler>();
        }

        public static void AddSpotifyService(this IServiceCollection services)
        {
            services.AddScoped<ISpotifyService, SpotifyService>();
        }
    }
}