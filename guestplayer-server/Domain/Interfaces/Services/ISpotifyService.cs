using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ISpotifyService
    {
        void SetAccessToken(string token);
        Task<SpotifyCredentials> GetAccessToken(String code);
        Task<Track> GetTrack(string uri);
    }
}
