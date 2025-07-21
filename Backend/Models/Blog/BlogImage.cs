namespace Backend.Models
{
    public class BlogImage
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string UploadDate { get; set; } = string.Empty;
    }
}