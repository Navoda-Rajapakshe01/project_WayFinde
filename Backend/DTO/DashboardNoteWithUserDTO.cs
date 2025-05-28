namespace Backend.DTOs
{
    public class DashboardNoteWithUserDTO
    {
        public int Id { get; set; }
        public string NoteTitle { get; set; } = string.Empty;
        public string NoteDescription { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
        public int TripId { get; set; }

        // Extra user info
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
