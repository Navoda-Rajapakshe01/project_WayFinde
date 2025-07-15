using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int PlaceId { get; set; }

        [ForeignKey("PlaceId")]
        public PlacesToVisit? Place { get; set; }

        public string? Name { get; set; }

        public string? Email { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}