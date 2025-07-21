using System;
using System.Collections.Generic;
using Backend.DTOs;


namespace Backend.DTOs
{
    public class UpdateTripRequest
    {
        public int TripId { get; set; }
        public string? TripName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? UserId { get; set; }

        public required List<int> PlaceIds { get; set; }
    }
}
