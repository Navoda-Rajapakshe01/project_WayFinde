using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models; // Add this to access UserNew

namespace Backend.Models.Post
{
    public class Post
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty; // Added Title field

        public string Content { get; set; } = string.Empty; // Changed from Caption to Content

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public UserNew User { get; set; } = null!;

        public string Tags { get; set; } = string.Empty; // Added Tags field

        public int NumberOfComments { get; set; } = 0;

        public int NumberOfReads { get; set; } = 0; // Added NumberOfReads field

        public int NumberOfReacts { get; set; } = 0;

        public string CoverImageUrl { get; set; } = string.Empty; // Added CoverImageUrl field

        public string ImageUrls { get; set; } = string.Empty; // Changed to string (likely JSON or comma-separated)

        // Navigation properties (these won't map to database columns)
        public virtual ICollection<PostImage> Images { get; set; } = new List<PostImage>();
        public virtual ICollection<PostComment> Comments { get; set; } = new List<PostComment>();
        public virtual ICollection<PostReaction> Reactions { get; set; } = new List<PostReaction>();

        // Helper property to work with ImageUrls as a List<string>
        [NotMapped]
        public List<string> ImageUrlsList
        {
            get
            {
                if (string.IsNullOrEmpty(ImageUrls))
                    return new List<string>();

                try
                {
                    // Try to parse as JSON first
                    return System.Text.Json.JsonSerializer.Deserialize<List<string>>(ImageUrls) ?? new List<string>();
                }
                catch
                {
                    // If JSON fails, try comma-separated values
                    return ImageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                   .Select(url => url.Trim())
                                   .ToList();
                }
            }
            set
            {
                // Store as JSON
                ImageUrls = System.Text.Json.JsonSerializer.Serialize(value ?? new List<string>());
            }
        }
    }
}