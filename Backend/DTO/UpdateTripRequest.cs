using System;
using System.Collections.Generic;

namespace Backend.DTO
{
    public class UpdateTripRequest
    {
        public int TripId { get; set; }
        public string? TripName { get; set; }
        public string? TripTime { get; set; }
        public decimal? TotalSpend { get; set; }
        public double? TripDistance { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? UserId { get; set; }
        public List<int>? PlaceIds { get; set; }
    }
}

