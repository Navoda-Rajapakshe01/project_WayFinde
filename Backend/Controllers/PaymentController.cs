using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Stripe;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _config;

    public PaymentsController(IConfiguration config)
    {
        _config = config;
        StripeConfiguration.ApiKey = _config["Stripe:SecretKey"]; // Make sure this is in appsettings.json
    }

    [HttpPost("create-checkout-session")]
    public IActionResult CreateCheckoutSession([FromBody] CreateCheckoutSessionRequest request)
    {
        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest("Description (product name) cannot be empty.");
        }

        if (request.TotalAmount <= 0)
        {
            return BadRequest("Amount must be greater than 0.");
        }

        var name = string.IsNullOrWhiteSpace(request.ItemName) ? "Reservation" : request.ItemName;
        var description = string.IsNullOrWhiteSpace(request.Description)
            ? $"Booking for {name}"
            : request.Description;


        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "LKR",
                        UnitAmountDecimal = request.TotalAmount * 100,
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = request.ItemName,
                    Description = request.Description
                }
            },
                    Quantity = 1
                }
            },
            Mode = "payment",
            SuccessUrl = "http://localhost:5173/payment/success",
            CancelUrl = "http://localhost:5173/payment/cancel",
            CustomerEmail = request.Email,

            Metadata = new Dictionary<string, string>
            {
                { "reservation_type", request.ReservationType },
                { "item_id", request.ItemId.ToString() },
                { "customer_name", request.CustomerName },
                { "start_date", request.StartDate.ToString("yyyy-MM-dd") },
                { "end_date", request.EndDate.ToString("yyyy-MM-dd") },
                { "guests", request.Guests.ToString() },
                { "total_amount", request.TotalAmount.ToString() },
                { "additional_requirements", request.AdditionalRequirements ?? "" },
                { "pickup_location", request.PickupLocation ?? "" },
                { "return_location", request.ReturnLocation ?? "" },
                { "phone", request.Phone ?? "" },
                { "order_id", request.OrderId ?? "" }
            }
        };

        var service = new SessionService();
        Session session = service.Create(options);

        return Ok(new { url = session.Url });

    }
}

public class CreateCheckoutSessionRequest
{
    public decimal TotalAmount { get; set; }
    public string ReservationType { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public int ItemId { get; set; }
    public string Description { get; set; } = "";
    public string ItemName { get; set; } = "";           // ✅ Needed for Stripe product name
    public int Guests { get; set; }                      // ✅ Needed for metadata

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string PickupLocation { get; set; } = "";
    public string ReturnLocation { get; set; } = "";
    public string AdditionalRequirements { get; set; } = "";

    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string OrderId { get; set; } = "";
}
