using Backend.Models;

namespace Backend.Models
{
    public class PaymentRequest
    {
        public string ReservationType { get; set; } // "accommodation"
        public AccommodationPayload Payload { get; set; }

        // Move these to root level for Stripe or other gateway
        public string ItemName { get; set; }
        public string Description { get; set; }
    }
}