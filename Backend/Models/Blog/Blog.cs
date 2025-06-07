using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
        public class Blog
        {
                public int Id { get; set; }

                [Required]
                [MaxLength(200)]
                public string Title { get; set; } = string.Empty;

                [Required]
                public string BlogUrl { get; set; } = string.Empty;

                public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

                [Required]
                public Guid UserId { get; set; }
                [ForeignKey("UserId")]
                 public UserNew User { get; set; } = null!;

                public int DistrictId { get; set; }
                [ForeignKey("DistrictId")]
                public District District { get; set; } = null!;
                [Required]

                public string Location { get; set; } = null;
                public List<string> Tags { get; set; } = new List<string>();

                public int NumberOfComments { get; set; } = 0;

                public int NumberOfReads { get; set; } = 0;

                public int NumberOfReacts { get; set; } = 0;

                [Required]
                public string Author { get; set; } = string.Empty;

                public string CoverImageUrl { get; set; } = string.Empty;

                public List<string> ImageUrls { get; set; } = new();


                // One blog has many comments
                public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}