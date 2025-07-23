// Models/PaymentRequest.cs
public class PaymentRequest
{
    public string ReservationType { get; set; } // "accommodation"
    public AccommodationPayload Payload { get; set; }
}

public class AccommodationPayload
{
    public int AccommodationId { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public int Guests { get; set; }
    public string AdditionalRequirements { get; set; }
    public decimal TotalAmount { get; set; }
    public int? TripId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string ItemName { get; set; }
    public string OrderId { get; set; }
    public string Description { get; set; }
}
