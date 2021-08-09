using Domain.Config;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Push.Services;
using System;
using System.Collections.Generic;
using System.Text;
using WebPush;

namespace Push
{
    public static class PushServiceCollectionExtensions
    {

        public static void AddPushServices(this IServiceCollection services, IConfiguration configuration)
        {
            var configSection = configuration.GetSection(WebPushConfig.SectionName);
            var config = configSection.Get<WebPushConfig>();
            services.Configure<WebPushConfig>(configSection);

            services.AddScoped<IPushNotificationService, PushNotificationService>();

            // Web push client
            services.AddScoped<WebPushClient>((IServiceProvider provider) => {
                var client = new WebPushClient();
                client.SetVapidDetails("https://guestplayer.camtittle.com", config.PublicKey, config.PrivateKey);
                return client;
            });
        }
    }
}
