namespace Backend.Models
{
    public class PlacesToVisit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MainImageUrl { get; set; }
        public string Description { get; set; }
        public string? History { get; set; }
        public string? OpeningHours { get; set; }
        public string? Address { get; set; }
        public string? GoogleMapLink { get; set; }

        public decimal? Latitude { get; set; }    // ?? nullable decimal
        public decimal? Longitude { get; set; }   // ?? nullable decimal



        // Foreign Key to District
        public int DistrictId { get; set; }
        public District District { get; set; }
    }
}
