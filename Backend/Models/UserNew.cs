namespace Backend.Models
{
    public class UserNew
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "NormalUser";

        public string? ServiceType { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
        
        public string? RegisteredDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
        public string? LastLoginDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
        public string? Bio { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
