using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IGuestSpotifyService
    {
        Task<Track[]> SearchTracks(string term);
        Task<Track> GetTrack(string uri);
    }
}
