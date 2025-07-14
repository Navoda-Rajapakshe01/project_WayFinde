using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("UsersNew")]
    public class UserNew
    {
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        [Column("Password")]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        public string ContactEmail { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = "NormalUser";
        [Required]
        public string? ServiceType { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; } = string.Empty;

        public string? RegisteredDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
        public string? LastLoginDate { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
        public string? Bio { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public int FollowersCount { get; set; } = 0;
        public int FollowingCount { get; set; } = 0;

        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
        // Navigation properties
        public ICollection<Follows> Followers { get; set; } = new List<Follows>(); // Users who follow this user
        public ICollection<Follows> Following { get; set; } = new List<Follows>(); // Users this user is following
    }
}