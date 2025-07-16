using System;
using System.Collections.Generic;
using Backend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{

    public class TripDateDto
    {
        public int TripId { get; set; }
        public int PlaceId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
