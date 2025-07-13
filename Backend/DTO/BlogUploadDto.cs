using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UploadBlogDto
    {
        [Required]
        public required IFormFile Document { get; set; }

        [Required]
        public required IFormFile Image { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Author { get; set; }

        public required string Location { get; set; }
    }
}
