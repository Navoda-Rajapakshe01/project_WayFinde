using System;
using System.Collections.Generic;
using Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Backend.Models
{
    public class TripCollaborator
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TripId { get; set; }

        [ForeignKey("TripId")]
        public Trip Trip { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public UserNew User { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    }
}
