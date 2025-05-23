using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class DashboardNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string NoteTitle { get; set; } = string.Empty;

        [Required]
        public string NoteDescription { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow.Date;

        public TimeSpan CreatedTime { get; set; } = DateTime.Now.TimeOfDay;

        // Foreign key reference to UserNew (stored in UserDbContext)
        public Guid UserId { get; set; }  // Match with UserNew.Id (GUID)

        // No navigation property, since UserNew lives in a separate DbContext
    }
}
