using System;
using System.Collections.Generic;
using Backend.DTOs;
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
        public required Guid UserId { get; set; }

        [Required]
        public required List<int> PlaceIds { get; set; }



    }
}