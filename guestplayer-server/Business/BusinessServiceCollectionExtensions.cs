using Business.Services;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business
{
    public static class BusinessServiceCollectionExtensions
    {

        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IPartyService, PartyService>();
            services.AddScoped<ITrackRequestService, TrackRequestService>();
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        }
    }
}
