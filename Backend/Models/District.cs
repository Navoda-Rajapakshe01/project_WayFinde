using Backend.Models;

namespace Backend.Models
{
    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; } 
        public string Slug { get; set; }
    }
}
