﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Accommodation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public decimal PricePerNight { get; set; }

        [Required]
        public int Bedrooms { get; set; }

        [Required]
        public int Bathrooms { get; set; }

        [Required]
        public int MaxGuests { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public bool IsAvailable { get; set; } = true;


        [Required]
        public int DistrictId { get; set; }

        public District? District { get; set; }

        [Required]
        public int PlaceId { get; set; }
        public PlacesToVisit? PlacesToVisit { get; set; }

        // 🔑 Add supplier foreign key
        [Required]
        public Guid SupplierId { get; set; }

        public UserNew? Supplier { get; set; }

        // (Optional) Redundant field if you want to store the username too
        public string? SupplierUsername { get; set; }

        public List<AccommodationImage>? Images { get; set; }
        public List<AccommodationReview>? Reviews { get; set; }
        public List<AccommodationAmenity>? Amenities { get; set; }
    }
}
