using Backend.Models;

public class PlacesToVisit
{
    public int Id { get; set; }

    public required string Name { get; set; }
    public required string MainImageUrl { get; set; }
    public required string Description { get; set; }

    public string? History { get; set; }
    public string? OpeningHours { get; set; }
    public string? Address { get; set; }
    public string? GoogleMapLink { get; set; }

    public int DistrictId { get; set; }
    public required District District { get; set; }

    public int? CategoryId { get; set; }
    public required Category Category { get; set; }
}
