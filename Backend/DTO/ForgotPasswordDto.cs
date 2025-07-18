using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
