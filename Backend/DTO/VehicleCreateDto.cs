using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace Backend.DTOs
{
    public class VehicleCreateDto
    {
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public decimal PricePerDay { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int NumberOfPassengers { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string TransmissionType { get; set; } = string.Empty;
        public int DistrictId { get; set; }
        public int PlaceId { get; set; }
        public Guid SupplierId { get; set; }
        public List<string>? Amenities { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}