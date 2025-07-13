using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class AdminCreateDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }
}
