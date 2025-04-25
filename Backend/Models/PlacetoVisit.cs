namespace Backend.Models
{
    public class PlaceToVisit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MainImageUrl { get; set; }
        public string Description { get; set; }

        // Foreign Key to District
        public int DistrictId { get; set; }
        public District District { get; set; }
    }
}
