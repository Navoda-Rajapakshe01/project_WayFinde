namespace Backend.DTOs
{
    public class VehicleReservationDTO
    {
        public int VehicleId { get; set; }
        public required string CustomerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public required string PickupLocation { get; set; }
        public required string ReturnLocation { get; set; }
        public string? AdditionalRequirements { get; set; }
        public decimal TotalAmount { get; set; }
        public int? TripId { get; set; }  // Nullable TripId
    }
}
