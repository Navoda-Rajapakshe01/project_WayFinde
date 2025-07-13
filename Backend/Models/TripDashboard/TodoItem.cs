namespace Backend.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string? TaskName { get; set; }  // Make it nullable
        
       // public string? TaskDescription { get; set; } 
        public string? TaskStatus { get; set; }  // Make it nullable
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}