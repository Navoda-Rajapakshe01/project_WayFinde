namespace Backend.DTOs
{
    public class UpdatePlaceDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string History { get; set; }
        public string OpeningHours { get; set; }
        public string Address { get; set; }
        public string GoogleMapLink { get; set; }
        public string MainImageUrl { get; set; }
        public int DistrictId { get; set; }
        public int? CategoryId { get; set; }
    }
}