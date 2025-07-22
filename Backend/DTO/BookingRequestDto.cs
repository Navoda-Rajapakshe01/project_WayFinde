public class BookingRequestDto
{
    public string Type { get; set; } // "vehicle" or "accommodation"
    public int ItemId { get; set; }
    public Guid UserId { get; set; } // Or Guid, depending on your project
    public string CustomerName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Guests { get; set; }
    public decimal Amount { get; set; }
    public string ItemName { get; set; }
}
