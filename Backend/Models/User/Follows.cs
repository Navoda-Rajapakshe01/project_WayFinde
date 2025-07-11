namespace Backend.Models
{
    public class Follows
    {
        public Guid FollowerID { get; set; }
        public Guid FollowedID { get; set; }

        public DateTime FollowDate { get; set; } = DateTime.Now;

        // Navigation properties
        public required UserNew Follower { get; set; }
        public required UserNew Followed { get; set; }
    }
}
