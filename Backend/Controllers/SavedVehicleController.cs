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
    public class SavedVehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedVehicleController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedVehicle
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedVehicle>>> GetSavedVehicles()
        {
            return await _context.Set<SavedVehicle>().ToListAsync();
        }

        // GET: api/SavedVehicle/{tripId}/{vehicleId}
        [HttpGet("{tripId}/{vehicleId}")]
        public async Task<ActionResult<SavedVehicle>> GetSavedVehicle(int tripId, int vehicleId)
        {
            var savedVehicle = await _context.Set<SavedVehicle>().FindAsync(tripId, vehicleId);
            if (savedVehicle == null)
            {
                return NotFound();
            }
            return savedVehicle;
        }

        // GET: api/SavedVehicle/trip/{tripId}
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<SavedVehicle>>> GetSavedVehiclesByTrip(int tripId)
        {
            var savedVehicles = await _context.Set<SavedVehicle>()
                .Where(sv => sv.TripId == tripId)
                .ToListAsync();
            return Ok(savedVehicles);
        }

        // POST: api/SavedVehicle
        [HttpPost]
        public async Task<ActionResult<SavedVehicle>> PostSavedVehicle([FromBody] SavedVehicle savedVehicle)
        {
            _context.Set<SavedVehicle>().Add(savedVehicle);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSavedVehicle), new { tripId = savedVehicle.TripId, vehicleId = savedVehicle.VehicleId }, savedVehicle);
        }

        // DELETE: api/SavedVehicle/{tripId}/{vehicleId}
        [HttpDelete("{tripId}/{vehicleId}")]
        public async Task<IActionResult> DeleteSavedVehicle(int tripId, int vehicleId)
        {
            var savedVehicle = await _context.Set<SavedVehicle>().FindAsync(tripId, vehicleId);
            if (savedVehicle == null)
            {
                return NotFound();
            }
            _context.Set<SavedVehicle>().Remove(savedVehicle);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 