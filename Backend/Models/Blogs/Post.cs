namespace Backend.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid UserId { get; set; }
        public UserNew User { get; set; } = null!;
        public List<string> ImagesUrl { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
    }
}
