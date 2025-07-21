namespace Backend.DTO
{
    public class PaymentRequestDto
    {
        public string OrderId { get; set; }
        public string ItemName { get; set; }
        public decimal TotalAmount { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}
