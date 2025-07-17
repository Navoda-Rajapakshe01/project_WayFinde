using System;
using System.Collections.Generic;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Trip
    {
        public int Id { get; set; }

        [Required]
        public string TripName { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; }  // timestamps:true
        public DateTime UpdatedAt { get; set; }

        // Navigation property for many-to-many relation to Places
        public ICollection<TripPlace> TripPlaces { get; set; } = new List<TripPlace>();

        public ICollection<TripCollaborator> Collaborators { get; set; } = new List<TripCollaborator>();

        public ICollection<TripDate> TripDates { get; set; } = new List<TripDate>();




    }
}
