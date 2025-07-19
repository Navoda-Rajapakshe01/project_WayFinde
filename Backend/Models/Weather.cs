using System;

namespace Backend.Models
{
    public class Weather
    {
        public double Temperature { get; set; }
        public double FeelsLike { get; set; }
        public int Humidity { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public double WindSpeed { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Location { get; set; } = string.Empty;
    }
} 