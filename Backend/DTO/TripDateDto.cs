using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TripDateDto
    {
        [Required]
        public int TripId { get; set; }

        [Required]
        public int PlaceId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }
} 