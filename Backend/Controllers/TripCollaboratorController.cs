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
    public class TripCollaboratorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripCollaboratorController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TripCollaborator
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripCollaborator>>> GetTripCollaborators()
        {
            return await _context.TripCollaborator
                .Include(tc => tc.Trip)
                .Include(tc => tc.User)
                .ToListAsync();
        }

        // GET: api/TripCollaborator/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TripCollaborator>> GetTripCollaborator(int id)
        {
            var tripCollaborator = await _context.TripCollaborator
                .Include(tc => tc.Trip)
                .Include(tc => tc.User)
                .FirstOrDefaultAsync(tc => tc.Id == id);

            if (tripCollaborator == null)
            {
                return NotFound();
            }

            return tripCollaborator;
        }

        // GET: api/TripCollaborator/trip/5
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<TripCollaborator>>> GetCollaboratorsByTrip(int tripId)
        {
            var collaborators = await _context.TripCollaborator
                .Include(tc => tc.User)
                .Where(tc => tc.TripId == tripId)
                .ToListAsync();

            return collaborators;
        }

        // POST: api/TripCollaborator
        [HttpPost]
        public async Task<ActionResult<TripCollaborator>> PostTripCollaborator(TripCollaborator tripCollaborator)
        {
            // Check if the trip exists
            var trip = await _context.Trips.FindAsync(tripCollaborator.TripId);
            if (trip == null)
            {
                return BadRequest("Trip not found");
            }

            // Check if the user exists
            var user = await _context.UsersNew.FindAsync(tripCollaborator.UserId);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Check if collaborator already exists
            var existingCollaborator = await _context.TripCollaborator
                .FirstOrDefaultAsync(tc => tc.TripId == tripCollaborator.TripId && tc.UserId == tripCollaborator.UserId);
            
            if (existingCollaborator != null)
            {
                return BadRequest("User is already a collaborator for this trip");
            }

            tripCollaborator.CreatedDate = DateTime.UtcNow;
            tripCollaborator.CreatedTime = DateTime.UtcNow;
            tripCollaborator.AddedAt = DateTime.UtcNow;

            _context.TripCollaborator.Add(tripCollaborator);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTripCollaborator), new { id = tripCollaborator.Id }, tripCollaborator);
        }

        // PUT: api/TripCollaborator/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTripCollaborator(int id, TripCollaborator tripCollaborator)
        {
            if (id != tripCollaborator.Id)
            {
                return BadRequest();
            }

            _context.Entry(tripCollaborator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripCollaboratorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TripCollaborator/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripCollaborator(int id)
        {
            var tripCollaborator = await _context.TripCollaborator.FindAsync(id);
            if (tripCollaborator == null)
            {
                return NotFound();
            }

            _context.TripCollaborator.Remove(tripCollaborator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TripCollaborator/trip/{tripId}/user/{userId}
        [HttpDelete("trip/{tripId}/user/{userId}")]
        public async Task<IActionResult> RemoveCollaborator(int tripId, Guid userId)
        {
            var tripCollaborator = await _context.TripCollaborator
                .FirstOrDefaultAsync(tc => tc.TripId == tripId && tc.UserId == userId);
            
            if (tripCollaborator == null)
            {
                return NotFound("Collaborator not found");
            }

            _context.TripCollaborator.Remove(tripCollaborator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripCollaboratorExists(int id)
        {
            return _context.TripCollaborator.Any(e => e.Id == id);
        }
    }
} 