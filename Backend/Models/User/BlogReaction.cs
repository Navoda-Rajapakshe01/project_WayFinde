using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models.User
{
    public class BlogReaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BlogId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("BlogId")]
        public virtual Blog Blog { get; set; }

        [ForeignKey("UserId")]
        public virtual UserNew User { get; set; }
    }
}
