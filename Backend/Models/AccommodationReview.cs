﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AccommodationReview
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AccommodationId { get; set; }

        [ForeignKey("AccommodationId")]
        public Accommodation? Accommodation { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }  // Change from ReviewerName to Name

        [StringLength(100)]
        public string? Email { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}