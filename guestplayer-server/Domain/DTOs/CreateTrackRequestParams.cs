using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.DTOs
{
    public class CreateTrackRequestParams
    {
        public Party Party { get; set; }
        public string UserId { get; set; }
        public string SpotifyTrackId { get; set; }
    }
}
