namespace Backend.Models
{
    public class AccommodationImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int AccommodationId { get; set; }
        public Accommodation? Accommodation { get; set; }
    }
}
