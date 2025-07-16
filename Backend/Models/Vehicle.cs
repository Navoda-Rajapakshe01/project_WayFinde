using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Brand { get; set; } = string.Empty;

        [Required]
        public string Model { get; set; } = string.Empty;

        [Required]
        public string? Type { get; set; }

        [Required]
        public int NumberOfPassengers { get; set; }

        [Required]
        public string? FuelType { get; set; }

        [Required]
        public string? TransmissionType { get; set; }

        [Required]
        public string? Location { get; set; }

        [Required]
        public decimal PricePerDay { get; set; }

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

        public List<VehicleImage>? Images { get; set; }
        public List<VehicleReview>? Reviews { get; set; }
        public List<VehicleAmenity>? Amenities { get; set; }
    }
}
