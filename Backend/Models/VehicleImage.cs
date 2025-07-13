namespace Backend.Models
{
    public class VehicleImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
