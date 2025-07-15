using Backend.Models;

namespace Backend.Models
{
    public class PlaceImage
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public required string ImageUrl { get; set; }
        public required PlacesToVisit PlacesToVisit { get; set; }
    }

}
