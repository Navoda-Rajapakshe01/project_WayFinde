using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/places/{placeId}/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ReviewsController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int placeId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.PlaceId == placeId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(int placeId, [FromBody] Review review)
        {
            if (!_context.PlacesToVisit.Any(p => p.Id == placeId))
            {
                return NotFound($"Place with ID {placeId} not found.");
            }

            review.PlaceId = placeId;
            review.CreatedAt = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Send SignalR notification to admins
            var place = await _context.PlacesToVisit.FindAsync(placeId);
            string placeName = place != null ? place.Name : $"ID {placeId}";
            string reviewer = !string.IsNullOrWhiteSpace(review.Name) ? review.Name : "A guest";
            string message = $"📝 {reviewer} submitted a new review for \"{placeName}\".";
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);

            return CreatedAtAction(nameof(GetReviews), new { placeId = placeId }, new
            {
                review.Id,
                review.PlaceId,
                review.Name,
                review.Email,
                review.Comment,
                review.Rating,
                review.CreatedAt
            });
        }
    }
}
