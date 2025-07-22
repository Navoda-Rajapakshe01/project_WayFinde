namespace Backend.DTOs
{
    public class VehicleReviewCreateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
    }
}
