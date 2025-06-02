using Backend.Models;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Name), nameof(DistrictId), IsUnique = true)]
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
   

    public int? CategoryId { get; set; }
  
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<PlaceImage> PlaceImage { get; set; }

}
