namespace Backend.DTOs
{
    public class VehicleReservationDTO
    {
        public int VehicleId { get; set; }
        public string CustomerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PickupLocation { get; set; }
        public string ReturnLocation { get; set; }
        public string AdditionalRequirements { get; set; }
        public decimal TotalAmount { get; set; }
        public int? TripId { get; set; }  // Nullable TripId
    }
}
