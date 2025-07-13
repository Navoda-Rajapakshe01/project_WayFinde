using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Backend.Models; 

namespace Backend.Models
{
    [Index(nameof(Name), nameof(DistrictId), IsUnique = true)] // Ensure unique index for Name and DistrictId
    public class PlacesToVisit
    {
        public int Id { get; set; }

        // Ensuring required properties for validation
        public required string Name { get; set; }  // Make sure it is required through model validation or EF

        // Other required fields
        public required string MainImageUrl { get; set; }
        public required string Description { get; set; }

        // Optional fields
        public string? History { get; set; }
        public string? OpeningHours { get; set; }
        public string? Address { get; set; }
        public string? GoogleMapLink { get; set; }

        // Rating and number of ratings
        public double? Rating { get; set; }
        public int? HowManyRated { get; set; }

        // Average spend and time for the place
        public decimal? AvgSpend { get; set; }
        public string? AvgTime { get; set; }

        // Type of the place (e.g., relax, do, stay)
        public string? PlaceType { get; set; }

        // Navigation properties for relationships
        public required ICollection<TripPlace> TripPlaces { get; set; }

        // Foreign key relationships
        public int DistrictId { get; set; }
        public required District District { get; set; }

        public required int CategoryId { get; set; }
        public required Category Category { get; set; }

        // Reviews and images related to this place
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<PlaceImage>? PlaceImage { get; set; }
    }
}