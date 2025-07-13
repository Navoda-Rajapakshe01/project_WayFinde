using System;
using System.Collections.Generic;
using Backend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs

{
    public class TripCreateDto
    {
        [Required]
        public string TripName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public List<int> PlaceIds { get; set; }



    }
}