using Microsoft.Extensions.Options;
using Spotify.Client.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Spotify.Client
{
    class AuthHeaderHandler : DelegatingHandler
    {

        private string Token { get; set; }

        public AuthHeaderHandler(IOptions<SpotifyConfig> options)
        {
            var config = options.Value;
            var authHeaderValue = config.ClientId + ":" + config.Secret;
            Token = Convert.ToBase64String(Encoding.UTF8.GetBytes(authHeaderValue));
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Token);

            return await base.SendAsync(request, cancellationToken).ConfigureAwait(false);
        }
    }
}
