namespace Backend.DTO
{
    public class PatchTripRequest
    {
        public string? TripName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
} 