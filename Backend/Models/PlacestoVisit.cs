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
        public string Name { get; set; }  // Make sure it is required through model validation or EF

        // Other required fields
        public string MainImageUrl { get; set; }
        public string Description { get; set; }

        // Optional fields
        public string? History { get; set; }
        public string? OpeningHours { get; set; }
        public string? Address { get; set; }
        public string? GoogleMapLink { get; set; }


        // Average spend and time for the place
        public decimal? AvgSpend { get; set; }
        public string? AvgTime { get; set; }


        // Navigation properties for relationships
        public ICollection<TripPlace> TripPlaces { get; set; }

        // Foreign key relationships
        public int DistrictId { get; set; }
        public District District { get; set; }

        public int? CategoryId { get; set; }
        public Category Category { get; set; }

        // Reviews and images related to this place
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<PlaceImage> PlaceImage { get; set; }
    }
}
