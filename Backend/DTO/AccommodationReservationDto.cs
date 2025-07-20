namespace Backend.DTOs
{
    public class AccommodationReservationDto
    {
        public int AccommodationId { get; set; }
        public DateTime CheckInDate { get; set; }  // maps to StartDate
        public DateTime CheckOutDate { get; set; } // maps to EndDate
        public int Guests { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string SpecialRequests { get; set; } = string.Empty;
        public int? TripId { get; set; }
    }
}
