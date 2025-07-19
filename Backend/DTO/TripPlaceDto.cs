using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class TripPlaceDto
    {
        [Required]
        public int TripId { get; set; }

        [Required]
        public int PlaceId { get; set; }
    }
} 