namespace Backend.Models
{
    public class Follower
    {
        public int Id { get; set; }
        public Guid FollowerId { get; set; }
        public Guid FolloweingId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        
    }
}
