
namespace Backend.Models
{
    public class TripLocation
    {
        public int TripId { get; set; } // Foreign key to Trip
        public Trip Trip { get; set; } // Navigation property
        public int PlaceToVisitId { get; set; } // Foreign key to PlaceToVisit
        public PlaceToVisit PlaceToVisit { get; set; } // Navigation property
    }

}
