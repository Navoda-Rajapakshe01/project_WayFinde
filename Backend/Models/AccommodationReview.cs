namespace Backend.Models
{
    public class AccommodationReview
    {
        public int Id { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public string? Comment { get; set; }
        public int Rating { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;

        public int AccommodationId { get; set; }
        public Accommodation? Accommodation { get; set; }
    }
}