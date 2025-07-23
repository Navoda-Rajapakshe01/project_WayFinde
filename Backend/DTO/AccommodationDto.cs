using System;
using System.Collections.Generic;

namespace Backend.DTOs
{
    public class AccommodationDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public decimal PricePerNight { get; set; }

        public int Bedrooms { get; set; }

        public int Bathrooms { get; set; }

        public int MaxGuests { get; set; }

        public string Description { get; set; } = string.Empty;

        public bool IsAvailable { get; set; }

        public int DistrictId { get; set; }
        public int PlaceId { get; set; }

        public Guid? SupplierId { get; set; } // ⭐ NEW
        public string? SupplierUsername { get; set; } // ⭐ NEW
        public List<string> ImageUrls { get; set; } = new List<string>();

        public List<string> Amenities { get; set; } = new List<string>();

    }
}