using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTO
{
    public class TodoItemDTO
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string TaskName { get; set; }

        public string? TaskStatus { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public int TripId { get; set; }
    }
}