using Business;
using Database;
using Domain.Config;
using Domain.Interfaces.Services;
using guestplayer_server.Helpers;
using guestplayer_server.Websockets.Hubs;
using guestplayer_server.Websockets.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Push;
using Spotify;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helpers;

namespace guestplayer_server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // CORS
            services.AddCors(
                options =>
                {
                    options.AddDefaultPolicy(builder => builder.WithOrigins("http://localhost:3000", "http://localhost:4000", "https://guestplayer.camtittle.com").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
                });


            // Auth
            services.AddSingleton<JwtService>();

            // Config
            services.Configure<AuthConfig>(Configuration.GetSection(AuthConfig.SectionName));

            // Spotify
            services.AddSpotifyClient(Configuration);
            services.AddSpotifyService();

            // Database
            services.AddRepositories(Configuration);

            // Services
            services.AddServices(Configuration);

            // Push
            services.AddPushServices(Configuration);

            // Controllers
            services.AddControllers();

            // SignalR
            services.AddSignalR();
            services.AddScoped<IWebsocketService, WebsocketService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();

            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<PartyHub>("/hubs/party");
            });
        }
    }
}
