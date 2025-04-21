
namespace Backend.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string TripName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Foreign key to User
        public User User { get; set; }  // Navigation property
    }
}
