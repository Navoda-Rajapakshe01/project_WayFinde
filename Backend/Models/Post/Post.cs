using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Models; // Add this to access District and UserNew

namespace Backend.Models.Post // Keep the namespace as Backend.Models.Post
{
    public class Post
    {
        public int Id { get; set; }
        public string Caption { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public UserNew User { get; set; } = null!;

        public int NumberOfReacts { get; set; } = 0;

        public List<string> ImageUrls { get; set; } = new();

        // Navigation properties
        public virtual ICollection<PostImage> Images { get; set; } = new List<PostImage>();
    }
}