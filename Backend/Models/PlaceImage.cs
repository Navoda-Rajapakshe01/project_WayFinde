using Backend.Models;

namespace Backend.Models
{
    public class PlaceImage
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public string ImageUrl { get; set; }
        public PlacesToVisit PlacesToVisit { get; set; }
    }

}
