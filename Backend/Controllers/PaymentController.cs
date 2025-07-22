using Microsoft.AspNetCore.Mvc;
using Backend.DTO;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private const string MerchantId = "1231285";  // Your sandbox merchant ID
        private const string MerchantSecret = "4034831300248320874625965917063830912806";        // Your merchant secret here
        private const string ReturnUrl = "http://localhost:5173/payment/success";
        private const string CancelUrl = "http://localhost:5173/payment/cancel";
        private const string NotifyUrl = "http://localhost:5030/api/payments/verify";

        // Helper method to generate PayHere hash
        private string GeneratePayHereHash(string orderId, decimal amount, string currency = "LKR")
        {
            using var md5 = MD5.Create();

            string innerHash;
            {
                var innerBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(MerchantSecret.ToUpper()));
                innerHash = BitConverter.ToString(innerBytes).Replace("-", "").ToUpper();
            }

            string rawString = MerchantId + orderId + amount.ToString("F2") + currency + innerHash;
            var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(rawString));
            return BitConverter.ToString(bytes).Replace("-", "").ToUpper();
        }

        [HttpPost("create")]
        public IActionResult CreatePayment([FromBody] PaymentRequestDto request)
        {
            string hash = GeneratePayHereHash(request.OrderId, request.TotalAmount);

            var paymentData = new
            {
                sandbox = true,
                merchant_id = MerchantId,
                return_url = ReturnUrl,
                cancel_url = CancelUrl,
                notify_url = NotifyUrl,
                order_id = request.OrderId,
                items = request.ItemName,
                amount = request.TotalAmount.ToString("F2"),
                currency = "LKR",
                hash = hash,
                first_name = request.FirstName,
                last_name = request.LastName ?? "",
                email = request.Email,
                phone = request.Phone,
                address = request.Address ?? "N/A",
                city = request.City ?? "N/A",
                country = "Sri Lanka"
            };

            // Return the payment data JSON for frontend to use with payhere.js SDK
            return Ok(paymentData);
        }

        // Implement notify_url endpoint to receive payment notifications from PayHere
        [HttpPost("verify")]
        public IActionResult VerifyPayment([FromForm] PayHereNotificationDto notification)
        {
            // Verify hash as per PayHere docs (md5sig verification)
            string localMd5Sig = GenerateMd5Signature(notification);

            if (localMd5Sig == notification.Md5Sig && notification.StatusCode == 2)
            {
                // Payment successful - update booking/payment status in DB here
                return Ok("Payment verified and accepted");
            }
            else
            {
                // Payment failed or invalid notification
                return BadRequest("Invalid payment notification");
            }
        }

        // Helper to generate md5sig for verification
        private string GenerateMd5Signature(PayHereNotificationDto notification)
        {
            using var md5 = MD5.Create();

            string innerHash;
            {
                var innerBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(MerchantSecret.ToUpper()));
                innerHash = BitConverter.ToString(innerBytes).Replace("-", "").ToUpper();
            }

            string rawString = notification.MerchantId
                + notification.OrderId
                + notification.PayhereAmount.ToString("F2")
                + notification.PayhereCurrency
                + notification.StatusCode.ToString()
                + innerHash;

            var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(rawString));
            return BitConverter.ToString(bytes).Replace("-", "").ToUpper();
        }
    }

    // DTO for PayHere notify POST params
    public class PayHereNotificationDto
    {
        [FromForm(Name = "merchant_id")]
        public required string MerchantId { get; set; }
        [FromForm(Name = "order_id")]
        public required string OrderId { get; set; }
        [FromForm(Name = "payhere_amount")]
        public decimal PayhereAmount { get; set; }
        [FromForm(Name = "payhere_currency")]
        public required string PayhereCurrency { get; set; }
        [FromForm(Name = "status_code")]
        public int StatusCode { get; set; }
        [FromForm(Name = "md5sig")]
        public required string Md5Sig { get; set; }
    }
}
