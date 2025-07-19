namespace Backend.DTOs
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int NumberOfPassengers { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string TransmissionType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal PricePerDay { get; set; }
        public bool IsAvailable { get; set; }
        public int DistrictId { get; set; }
        public int PlaceId { get; set; }
        public Guid SupplierId { get; set; }
        public string SupplierUsername { get; set; } = string.Empty;

        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string> Amenities { get; set; } = new List<string>();
    }
}
