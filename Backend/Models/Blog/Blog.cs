using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        [Required]

        public string BlogUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
        public UserNew User { get; set; } = null!;
        public string? Location { get; set; } = string.Empty;

        public List<string> Tags { get; set; } = new List<string>();

        public int NumberOfComments { get; set; } = 0;


        public int NumberOfReads { get; set; } = 0;
        public int NumberOfReacts { get; set; } = 0;
        public string Author { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();

    }

}
