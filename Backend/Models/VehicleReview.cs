namespace Backend.Models
{
    public class VehicleReview
    {
        public int Id { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public string? Comment { get; set; }
        public int Rating { get; set; }
        public DateTime DatePosted { get; set; } = DateTime.Now;

        public int VehicleId { get; set; }
        public string? Vehicle { get; set; } = string.Empty;

    }
}