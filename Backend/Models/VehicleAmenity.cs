using System.Text.Json.Serialization;
using Backend.Models;

public class VehicleAmenity
{
    public int Id { get; set; }
    public int VehicleId { get; set; }

    [JsonIgnore]
    public Vehicle? Vehicle { get; set; }

    public string AmenityName { get; set; } = string.Empty;
}
