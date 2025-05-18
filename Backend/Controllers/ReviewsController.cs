using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/places/{placeId}/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
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

            return CreatedAtAction(nameof(GetReviews), new { placeId = placeId }, review);
        }
    }
}
