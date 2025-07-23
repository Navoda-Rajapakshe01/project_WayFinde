using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class AccommodationReservation
    {
        public int Id { get; set; }
        public int AccommodationId { get; set; }
        public Accommodation? Accommodation { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }  // Add this line

        [ForeignKey("CustomerId")]
        public UserNew? Customer { get; set; }  // Optional: navigation property

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Guests { get; set; }
        public string AdditionalRequirements { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public int? TripId { get; set; }  // Nullable TripId field

        // Add these:
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? OrderId { get; set; }

    }
}
