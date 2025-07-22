namespace Backend.DTOs
    {
        public class VehicleReviewDto
        {
            public int Id { get; set; }
            public int VehicleId { get; set; }
            public string? VehicleInfo { get; set; }  // Brand + Model concatenation

            public required string Name { get; set; }
            public string? Email { get; set; }
            public int Rating { get; set; }
            public string? Comment { get; set; }
            public DateTime CreatedAt { get; set; }
        }
    }

