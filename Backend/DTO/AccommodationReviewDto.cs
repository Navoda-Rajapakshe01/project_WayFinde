namespace Backend.DTO
{
    public class AccommodationReviewDto
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string? AccommodationInfo { get; set; }  // Brand + Model concatenation
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
