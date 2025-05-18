using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserDtoRegister
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string ContactEmail { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
    }
}