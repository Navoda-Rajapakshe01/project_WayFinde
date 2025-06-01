using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class UploadBlogDto
    {
        [Required]
        public IFormFile Document { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string Location { get; set; }
    }
}
