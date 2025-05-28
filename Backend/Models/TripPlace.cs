using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class TripPlace
    {
        public int TripId { get; set; }
        public int PlaceId { get; set; }

        // Navigation properties
        [ForeignKey("TripId")]
        public Trip Trip { get; set; }

        [ForeignKey("PlaceId")]
        public PlacesToVisit Place { get; set; }
    }

    public class TripPlaceDto
    {
        [Required]
        public int TripId { get; set; }

        [Required]
        public int PlaceId { get; set; }
    }
} 