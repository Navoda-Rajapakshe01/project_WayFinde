namespace Backend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string? Type { get; set; }
        public int NumberOfPassangers { get; set; }
        public string? FuelType { get; set; }
        public string? TransmissionType { get; set; }

        public string? Loation { get; set; }
        public string? OwnerName { get; set; }
        public string? Ownerity { get; set; }
        public string? Disription { get; set; }
        public Decimal PricePerDay { get; set; }
        public bool IsAvailable { get; set; } = true;
        public List<VehicleImage>? Images { get; set; }
        public List<VehicleReview>? Reviews { get; set; }

    }
}
