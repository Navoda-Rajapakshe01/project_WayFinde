using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Hubs;
using Backend.DTOs;
using Backend.DTO;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/accommodations/{accommodationId}/reviews")]
    public class AccommodationReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        public AccommodationReviewsController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccommodationReview>>> GetAccommodationReviews(int accommodationId)
        {
            var reviews = await _context.AccommodationReviews
                .Where(r => r.AccommodationId == accommodationId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
            return Ok(reviews);
        }
        [HttpGet("/api/accommodationreviews")]
        public async Task<ActionResult<IEnumerable<AccommodationReviewDto>>> GetAllAccommodationReviews()
        {
            var reviews = await _context.AccommodationReviews
                .Include(r => r.Accommodation)
                .Where(r => r.Accommodation != null)
                .Select(r => new AccommodationReviewDto
                {
                    Id = r.Id,
                    VehicleId = r.AccommodationId,
                    AccommodationInfo = r.Accommodation != null ? r.Accommodation.Name : null,
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
        [HttpGet("/api/accommodationreviews/Rcount")]
        public async Task<ActionResult<int>> GetTotalAccommodationReviewCount()
        {
            var count = await _context.AccommodationReviews.CountAsync();
            return Ok(count);
        }

        [HttpPost]
        public async Task<ActionResult<AccommodationReview>> PostAccommodationReview(int accommodationId, [FromBody] AccommodationReviewCreateDto reviewDto)
        {
            var accommodation = await _context.Accommodations.FindAsync(accommodationId);
            if (accommodation == null)
                return NotFound($"Accommodation with ID {accommodationId} not found.");

            if (string.IsNullOrWhiteSpace(reviewDto.Name))
            {
                ModelState.AddModelError("Name", "Name is required.");
                return ValidationProblem(ModelState);
            }

            var review = new AccommodationReview
            {
                AccommodationId = accommodationId,
                Name = reviewDto.Name,
                Email = reviewDto.Email,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };


            _context.AccommodationReviews.Add(review);
            await _context.SaveChangesAsync();

            string reviewer = !string.IsNullOrWhiteSpace(review.Name) ? review.Name : "A guest";
            string message = $" {reviewer} submitted a new review for {accommodation.Name}.";
            string url = $"/admin/reviews-management";
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                text = message,
                url = url
            });

            return CreatedAtAction(nameof(GetAccommodationReviews), new { accommodationId = accommodationId }, new
            {
                review.Id,
                review.AccommodationId,
                review.Name,
                review.Email,
                review.Comment,
                review.Rating,
                review.CreatedAt
            });
        }

        [HttpDelete("/api/accommodationreviews/{id}")]
        public async Task<IActionResult> DeleteAccommodationReview(int id)
        {
            var review = await _context.AccommodationReviews.FindAsync(id);
            if (review == null)
                return NotFound();

            _context.AccommodationReviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("/api/accommodation-reviews")]
        public async Task<ActionResult> GetAllReviews()
        {
            var reviews = await _context.AccommodationReviews
                .Include(r => r.Accommodation)
                .Select(static r => new
                {
                    r.Id,
                    r.AccommodationId,
                    AccommodationInfo = r.Accommodation != null ? r.Accommodation.Name : null,
                    r.Name,
                    r.Email,
                    r.Comment,
                    r.Rating,
                    r.CreatedAt
                })
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }
        [HttpGet("/api/accommodation-reviews/count")]
        public async Task<ActionResult<int>> GetReviewCount()
        {
            var count = await _context.AccommodationReviews.CountAsync();
            return Ok(count);
        }
    }
}