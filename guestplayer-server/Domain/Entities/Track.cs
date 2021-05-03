using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Track
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string ArtworkUrl { get; set; }
        public string Album { get; set; }
        public int DurationMs { get; set; }
    }
}
