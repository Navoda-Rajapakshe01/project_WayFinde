namespace Backend.DTO
{
    public class PaymentRequestDto
    {
        public required string OrderId { get; set; }
        public required string ItemName { get; set; }
        public decimal TotalAmount { get; set; }
        public required string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}
