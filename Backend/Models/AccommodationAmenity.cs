using System.Text.Json.Serialization;
using Backend.Models;

public class AccommodationAmenity
{
    public int Id { get; set; }
    public int AccommodationId { get; set; }

    [JsonIgnore]
    public Accommodation? Accommodation { get; set; }

    public string AmenityName { get; set; } = string.Empty;
}
