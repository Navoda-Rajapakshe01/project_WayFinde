using Backend.Models;

namespace Backend.Models
{
    public class District
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string ImageUrl { get; set; }
        public required string Slug { get; set; }
        public string? SubTitle { get; set; } 
        
        // Navigation property to PlacesToVisit
        public ICollection<PlacesToVisit> PlacesToVisit { get; set; } = new List<PlacesToVisit>();
    }
}