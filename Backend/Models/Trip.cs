using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("Trips")]
    public class Trip
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalSpend { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TripDistance { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TripTime { get; set; }

        [Required]
        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<TripPlace> TripPlaces { get; set; } = new List<TripPlace>();
        public virtual ICollection<TripCollaborator> TripCollaborators { get; set; } = new List<TripCollaborator>();
        public virtual ICollection<TodoItem> TodoItems { get; set; } = new List<TodoItem>();
        public virtual ICollection<DashboardNote> DashboardNotes { get; set; } = new List<DashboardNote>();
        public virtual ICollection<TravelBudget> TravelBudgets { get; set; } = new List<TravelBudget>();
    }
} 