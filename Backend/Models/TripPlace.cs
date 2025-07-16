using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models;

namespace Backend.Models
{
    public class TripPlace
    {
        public int TripId { get; set; }
        public Trip Trip { get; set; }

        public int PlaceId { get; set; }
        public PlacesToVisit Place { get; set; }
        public int Order { get; set; }
    }
}
