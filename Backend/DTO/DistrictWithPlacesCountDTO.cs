namespace Backend.DTOs
{
   public class DistrictWithPlacesCountDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public string Slug { get; set; }
    public int PlacesCount { get; set; }  
}

}
