using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedAccommodationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedAccommodationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedAccommodation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedAccommodation>>> GetSavedAccommodations()
        {
            return await _context.Set<SavedAccommodation>().ToListAsync();
        }

        // GET: api/SavedAccommodation/{tripId}/{accommodationId}
        [HttpGet("{tripId}/{accommodationId}")]
        public async Task<ActionResult<SavedAccommodation>> GetSavedAccommodation(int tripId, int accommodationId)
        {
            var savedAccommodation = await _context.Set<SavedAccommodation>().FindAsync(tripId, accommodationId);
            if (savedAccommodation == null)
            {
                return NotFound();
            }
            return savedAccommodation;
        }

        // GET: api/SavedAccommodation/trip/{tripId}
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<SavedAccommodation>>> GetSavedAccommodationsByTrip(int tripId)
        {
            var savedAccommodations = await _context.Set<SavedAccommodation>()
                .Where(sa => sa.TripId == tripId)
                .ToListAsync();
            return Ok(savedAccommodations);
        }

        // POST: api/SavedAccommodation
        [HttpPost]
        public async Task<ActionResult<SavedAccommodation>> PostSavedAccommodation([FromBody] SavedAccommodation savedAccommodation)
        {
            _context.Set<SavedAccommodation>().Add(savedAccommodation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSavedAccommodation), new { tripId = savedAccommodation.TripId, accommodationId = savedAccommodation.AccommodationId }, savedAccommodation);
        }

        // DELETE: api/SavedAccommodation/{tripId}/{accommodationId}
        [HttpDelete("{tripId}/{accommodationId}")]
        public async Task<IActionResult> DeleteSavedAccommodation(int tripId, int accommodationId)
        {
            var savedAccommodation = await _context.Set<SavedAccommodation>().FindAsync(tripId, accommodationId);
            if (savedAccommodation == null)
            {
                return NotFound();
            }
            _context.Set<SavedAccommodation>().Remove(savedAccommodation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 