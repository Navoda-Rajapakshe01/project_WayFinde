using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Post
{
    public class PostComment
    {
        [Key]
        public int Id { get; set; }

        public int PostId { get; set; }

        [ForeignKey("PostId")]
        public Post Post { get; set; } = null!;

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public UserNew User { get; set; } = null!;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}
