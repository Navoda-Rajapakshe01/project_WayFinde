using System.Text.Json.Serialization;
using Backend.Models;

public class VehicleReview
{
    public int Id { get; set; }
    public int VehicleId { get; set; }

    [JsonIgnore]
    public Vehicle? Vehicle { get; set; }

    public string ReviewerName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
