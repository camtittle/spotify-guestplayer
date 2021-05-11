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

            services.AddRefitClient<ISpotifyAccountsClient>()
                .ConfigureHttpClient(c => c.BaseAddress = new Uri(config.AccountsApiBaseUrl))
                .AddHttpMessageHandler<AuthHeaderHandler>();

            services.AddRefitClient<ISpotifyClient>()
                .ConfigureHttpClient(c => c.BaseAddress = new Uri(config.ApiBaseUrl));
        }

        public static void AddSpotifyService(this IServiceCollection services)
        {
            services.AddScoped<IHostSpotifyService, HostSpotifyService>();
            services.AddSingleton<IGuestSpotifyService, GuestSpotifyService>();
        }
    }
}