namespace Backend.Models
{
    public class UserBooking
    {
        public int BookingId { get; set; }
        public Guid UserId { get; set; }
        public string BookingType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
       
    }
}
