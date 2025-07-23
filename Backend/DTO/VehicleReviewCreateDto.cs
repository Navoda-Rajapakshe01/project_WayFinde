namespace Backend.DTOs
{
    public class VehicleReviewCreateDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Comment { get; set; }
        public int Rating { get; set; }
    }
}
