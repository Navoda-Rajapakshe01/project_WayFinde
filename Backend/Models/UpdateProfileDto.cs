namespace Backend.Models
{
    public class UpdateProfileDto
    {
        public required string Username { get; set; }
        public required string ContactEmail { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }

}