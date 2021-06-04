using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IHostSpotifyService
    {
        Task<SpotifyCredentials> GetAccessToken(string code);
        public Task<SpotifyCredentials> RefreshCredentials(SpotifyCredentials credentials);
        public Task PlayTrack(string trackId, PlayType type, SpotifyCredentials credentials);
    }
}
