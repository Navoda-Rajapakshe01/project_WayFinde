namespace Backend.DTOs
{
   public class DistrictWithPlacesCountDTO
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ImageUrl { get; set; }
    public string? Slug { get; set; }
        public string? SubTitle { get; set; }
        public int PlacesCount { get; set; }  
}

}