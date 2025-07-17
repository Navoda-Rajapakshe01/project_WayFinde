using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TripCreateDto
    {
        [Required]
        public required string TripName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public required string UserId { get; set; }

        [Required]
        public required List<int> PlaceIds { get; set; }
    }
}