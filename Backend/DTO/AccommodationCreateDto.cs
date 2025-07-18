using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Backend.DTOs
{
    public class AccommodationCreateDto
    {
        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public decimal PricePerNight { get; set; }

        public int Bedrooms { get; set; }

        public int Bathrooms { get; set; }

        public int MaxGuests { get; set; }

        public string Description { get; set; } = string.Empty;

        public int DistrictId { get; set; }

        public int PlaceId { get; set; } // ⭐ NEW

        public Guid SupplierId { get; set; } // ✅ Consistent with VehicleCreateDto

        public List<string>? Amenities { get; set; }

        public IFormFileCollection? Images { get; set; }
    }
}
