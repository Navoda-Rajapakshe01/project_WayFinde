namespace Backend.Models
{
    public class AccommodationReservation
    {
        public int Id { get; set; }
        public int AccommodationId { get; set; }
        public Accommodation? Accommodation { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Guests { get; set; }
        public string AdditionalRequirements { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public int? TripId { get; set; }  // Nullable TripId field
    }
}
