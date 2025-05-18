using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Blog
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Author { get; set; } = string.Empty;
        public string? Location { get; set; } = string.Empty;
        public int NumberOfReads { get; set; } = 0;
        public int NumberOfReacts { get; set; } = 0;
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    }
}
