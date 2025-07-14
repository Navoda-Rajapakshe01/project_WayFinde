using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("TripPlaces")]
    public class TripPlace
    {
        public int TripId { get; set; }
        public Trip Trip { get; set; }

        public int PlaceId { get; set; }
        public PlacesToVisit Place { get; set; }
    }
}