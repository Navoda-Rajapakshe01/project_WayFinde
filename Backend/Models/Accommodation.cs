namespace Backend.Models
{
    public class Accommodation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Type { get; set; }
        public int NumberOfGuests { get; set; }
        public int NumberOfBedRooms { get; set; }
        public int NumberOfBeds { get; set; }
        public int NumberOfBathRooms { get; set; }

        public string? Location { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerCity { get; set; }
        public string? Description { get; set; }
        public decimal PricePerDay { get; set; }
        public bool IsAvailable { get; set; } = true;

        public List<AccommodationImage>? Images { get; set; }
        public List<AccommodationReview>? Reviews { get; set; }

    }
}