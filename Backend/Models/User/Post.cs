using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public UserNew User { get; set; } = null!;

        public int DistrictId { get; set; }
        [ForeignKey("DistrictId")]
        public District District { get; set; } = null!;
        public List<string> Tags { get; set; } = new List<string>();
        public int NumberOfComments { get; set; } = 0;
        public int NumberOfReads { get; set; } = 0;
        public int NumberOfReacts { get; set; } = 0;
        public string CoverImageUrl { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();

        // One post has many comments
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
