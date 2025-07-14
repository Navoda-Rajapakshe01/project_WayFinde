using System;
using System.Collections.Generic;
using Backend.DTOs;

namespace Backend.DTOs
{
    public class TripDetailsDto
    {
        public int Id { get; set; }
        public required string TripName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double? TripDistance { get; set; }
        public string? TripTime { get; set; }
        public decimal? TotalSpend { get; set; }
        public required List<PlaceDto> Places { get; set; }
    }

    public class PlaceDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string GoogleMapLink { get; set; }
        public string? AvgTime { get; set; }
        public decimal? AvgSpend { get; set; }
        public double? Rating { get; set; }
        public int HowManyRated { get; set; }
        public string MainImageUrl { get; set; }

        public DistrictWithPlacesCountDTO  District { get; set; } 
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
