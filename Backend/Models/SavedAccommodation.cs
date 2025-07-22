using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("SavedAccommodations")]
    public class SavedAccommodation
    {
        [ForeignKey("Trip")]
        public int TripId { get; set; }

        [ForeignKey("Accommodation")]
        public int AccommodationId { get; set; }
    }
} 