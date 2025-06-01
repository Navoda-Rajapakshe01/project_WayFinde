using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public UserNew User { get; set; } = null!;
        public Blog Blog { get; set; } = null!;
       
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
