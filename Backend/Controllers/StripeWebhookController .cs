using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;
using Stripe.Checkout;
using Stripe;
using Backend.Models;
using Backend.Data;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/payments/webhook")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public StripeWebhookController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var endpointSecret = _config["Stripe:WebhookSecret"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    endpointSecret
                );

                if (stripeEvent.Type == "Checkout.Session.Completed")
                {
                    var session = stripeEvent.Data.Object as Session;
                    if (session == null || session.Metadata == null)
                        return BadRequest("Invalid session data");

                    var metadata = session.Metadata;

                    var reservationType = metadata["reservation_type"];
                    var customerName = metadata["customer_name"];
                    var itemId = int.Parse(metadata["item_id"]);
                    var startDate = DateTime.Parse(metadata["start_date"]);
                    var endDate = DateTime.Parse(metadata["end_date"]);
                    var additionalRequirements = metadata["additional_requirements"] ?? "";
                    var totalAmount = decimal.Parse(metadata["total_amount"]);
                    var email = session.CustomerEmail ?? metadata["email"];
                    var phone = metadata.ContainsKey("phone") ? metadata["phone"] : "";
                    var orderId = metadata.ContainsKey("order_id") ? metadata["order_id"] : "";

                    if (reservationType == "accommodation")
                    {
                        var guests = metadata.ContainsKey("guests") ? int.Parse(metadata["guests"]) : 1;

                        var reservation = new AccommodationReservation
                        {
                            AccommodationId = itemId,
                            CustomerName = customerName,
                            StartDate = startDate,
                            EndDate = endDate,
                            Guests = guests,
                            AdditionalRequirements = additionalRequirements,
                            TotalAmount = totalAmount,
                            Email = email,
                            Phone = phone,
                            OrderId = orderId,
                            Status = "Paid",
                            BookingDate = DateTime.UtcNow
                        };

                        _context.AccommodationReservations.Add(reservation);
                    }
                    else if (reservationType == "vehicle")
                    {
                        var pickup = metadata["pickup_location"] ?? "";
                        var drop = metadata["return_location"] ?? "";

                        var reservation = new VehicleReservation
                        {
                            VehicleId = int.Parse(metadata["vehicleId"]),
                            CustomerId = Guid.Parse(metadata["customerId"]),
                            CustomerName = metadata["customerName"],
                            StartDate = DateTime.Parse(metadata["startDate"]),
                            EndDate = DateTime.Parse(metadata["endDate"]),
                            PickupLocation = pickup,
                            ReturnLocation = drop,
                            AdditionalRequirements = additionalRequirements,
                            TotalAmount = totalAmount,
                            Email = email,
                            Phone = phone,
                            OrderId = orderId,
                            Status = "Paid",
                            BookingDate = DateTime.UtcNow
                        };

                        _context.VehicleReservations.Add(reservation);
                    }
                    else
                    {
                        return BadRequest("Unknown reservation type.");
                    }

                    await _context.SaveChangesAsync();
                    Console.WriteLine("✅ Reservation saved successfully.");
                }

                return Ok();
            }
            catch (StripeException ex)
            {
                Console.WriteLine($"❌ Stripe webhook error: {ex.Message}");
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ General error: {ex.Message}");
                return BadRequest();
            }
        }
    }
}
