using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Hubs;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/vehicles/{vehicleId}/reviews")]
    public class VehicleReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public VehicleReviewsController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleReview>>> GetVehicleReviews(int vehicleId)
        {
            var reviews = await _context.VehicleReviews
                .Where(r => r.VehicleId == vehicleId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("/api/vehiclereviews")]
        public async Task<ActionResult<IEnumerable<VehicleReviewDto>>> GetAllVehicleReviews()
        {
            var reviews = await _context.VehicleReviews
                .Include(r => r.Vehicle)
                .Where(r => r.Vehicle != null)
                .Select(r => new VehicleReviewDto
                {
                    Id = r.Id,
                    VehicleId = r.VehicleId,
                    VehicleInfo = r.Vehicle != null ? r.Vehicle.Brand + " " + r.Vehicle.Model : string.Empty,
                    Name = r.Name,
                    Email = r.Email,
                    Comment = r.Comment,
                    Rating = r.Rating,
                    CreatedAt = r.CreatedAt
                })
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }


        [HttpGet("/api/vehiclereviews/Rcount")]
        public async Task<ActionResult<int>> GetTotalVehicleReviewCount()
        {
            var count = await _context.VehicleReviews.CountAsync();
            return Ok(count);
        }

        [HttpPost]
        public async Task<ActionResult<VehicleReview>> PostVehicleReview(int vehicleId,[FromBody] VehicleReviewCreateDto reviewDto)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
                return NotFound($"Vehicle with ID {vehicleId} not found.");

            if (string.IsNullOrWhiteSpace(reviewDto.Name))
            {
                ModelState.AddModelError("Name", "Name is required.");
                return ValidationProblem(ModelState);
            }

            var review = new VehicleReview
            {
                VehicleId = vehicleId,
                Name = reviewDto.Name,
                Email = reviewDto.Email,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.VehicleReviews.Add(review);
            await _context.SaveChangesAsync();

            string reviewer = !string.IsNullOrWhiteSpace(review.Name) ? review.Name : "A guest";
            string message = $"🚗 {reviewer} submitted a new review for {vehicle.Brand} {vehicle.Model}.";
            string url = $"/admin/reviews-management";
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                text = message,
                url = url
            });

            return CreatedAtAction(nameof(GetVehicleReviews), new { vehicleId = vehicleId }, new
            {
                review.Id,
                review.VehicleId,
                review.Name,
                review.Email,
                review.Comment,
                review.Rating,
                review.CreatedAt
            });
        }

        [HttpDelete("/api/vehiclereviews/{id}")]
        public async Task<IActionResult> DeleteVehicleReview(int id)
        {
            var review = await _context.VehicleReviews.FindAsync(id);
            if (review == null)
                return NotFound();

            _context.VehicleReviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("/api/vehicle-reviews")]
        public async Task<ActionResult> GetAllReviews()
        {
            var reviews = await _context.VehicleReviews
                .Include(r => r.Vehicle)
                .Select(r => new
                {
                    r.Id,
                    r.VehicleId,
                    VehicleName = r.Vehicle != null ? r.Vehicle.Brand + " " + r.Vehicle.Model : null,
                    r.Name,
                    r.Email,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                })
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("/api/vehicle-reviews/count")]
        public async Task<ActionResult<int>> GetReviewCount()
        {
            int count = await _context.VehicleReviews.CountAsync();
            return Ok(count);
        }

    }
}
