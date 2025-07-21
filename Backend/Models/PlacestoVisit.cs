using Backend.Models;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Name), nameof(DistrictId), IsUnique = true)]
public class PlacesToVisit
{
        public int Id { get; set; }

        // Ensuring required properties for validation
        public required string Name { get; set; }  // Make sure it is required through model validation or EF

        // Other required fields
        public required string MainImageUrl { get; set; }
        public required string Description { get; set; }

    public string? History { get; set; }
    public string? OpeningHours { get; set; }
    public string? Address { get; set; }
    public string? GoogleMapLink { get; set; }


        // Average spend and time for the place
        public decimal? AvgSpend { get; set; }
        public string? AvgTime { get; set; }


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