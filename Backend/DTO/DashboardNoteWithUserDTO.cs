namespace Backend.DTOs
{
    public class DashboardNoteWithUserDTO
    {
        public int Id { get; set; }
        public string NoteTitle { get; set; } = string.Empty;
        public string NoteDescription { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public TimeSpan CreatedTime { get; set; }
        public Guid UserId { get; set; }

        // Extra user info from UserDbContext
        public string Username { get; set; } = string.Empty;
        public string? UrlImages { get; set; }

        // Add this property to make date + time available as one field:
        public DateTime CreatedAt => CreatedDate + CreatedTime;
    }
}
