using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccommodationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccommodationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Accommodation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Accommodation>>> GetAccommodations()
        {
            var accommodations = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Reviews)
                .ToListAsync();

            return Ok(accommodations);
        }

        // GET: api/Accommodation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Accommodation>> GetAccommodation(int id)
        {
            var accommodation = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Reviews)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (accommodation == null)
                return NotFound();

            return Ok(accommodation);
        }

        // POST: api/Accommodation/reserve
        [HttpPost("reserve")]
        public async Task<ActionResult> ReserveAccommodation([FromBody] AccommodationReservation reservation)
        {
            var accommodation = await _context.Accommodations.FindAsync(reservation.AccommodationId);
            if (accommodation == null || !accommodation.IsAvailable)
                return BadRequest("Accommodation not available.");

            _context.AccommodationReservations.Add(reservation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reservation successful!" });
        }

        // POST: api/Accommodation/review
        [HttpPost("review")]
        public async Task<ActionResult> AddReview([FromBody] AccommodationReview review)
        {
            var accommodation = await _context.Accommodations.FindAsync(review.AccommodationId);
            if (accommodation == null)
                return NotFound("Accommodation not found.");

            review.DatePosted = DateTime.Now;
            _context.AccommodationReviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review added successfully!" });
        }
    }
}
