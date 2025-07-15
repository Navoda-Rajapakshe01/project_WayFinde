namespace Backend.DTOs
{
    public class UpdatePlaceDTO
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string History { get; set; }
        public string? OpeningHours { get; set; }
        public string? Address { get; set; }
        public string? GoogleMapLink { get; set; }
        public required string MainImageUrl { get; set; }
        public int DistrictId { get; set; }
        public int? CategoryId { get; set; }
    }
}