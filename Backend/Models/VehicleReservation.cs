using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class VehicleReservation
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }  // Add this line

        [ForeignKey("CustomerId")]
        public UserNew? Customer { get; set; }  // Optional: navigation property

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PickupLocation { get; set; } = string.Empty;
        public string ReturnLocation { get; set; } = string.Empty;
        public string AdditionalRequirements { get; set; } = string.Empty; 
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public int? TripId { get; set; }  // Nullable TripId field

        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? OrderId { get; set; }
    }
}
