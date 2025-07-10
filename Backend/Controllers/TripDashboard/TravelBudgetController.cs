using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelBudgetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TravelBudgetController(AppDbContext context) => _context = context;

        // GET: api/TravelBudget/trip/{tripId}
        // Retrieves all budget entries for a specific trip
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> GetByTripId(int tripId)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            var budgets = await _context.TravelBudgets
                .Where(b => b.TripId == tripId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(budgets);
        }

        // GET: api/TravelBudget
        // Retrieves all budget entries from the database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> Get() =>
            await _context.TravelBudgets.ToListAsync();

        // GET: api/TravelBudget/{id}
        // Retrieves a specific budget entry by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelBudget>> Get(int id)
        {
            var travelBudget = await _context.TravelBudgets.FindAsync(id);
            return travelBudget == null ? NotFound() : Ok(travelBudget);
        }

        // POST: api/TravelBudget
        // Creates a new budget entry for a trip
        [HttpPost]
        public async Task<ActionResult<TravelBudget>> Post(TravelBudget travelBudget)
        {
            var trip = await _context.Trips.FindAsync(travelBudget.TripId);
            if (trip == null)
                return BadRequest("Invalid TripId");

            travelBudget.CreatedAt = DateTime.UtcNow;
            travelBudget.UpdatedAt = DateTime.UtcNow;
            
            _context.TravelBudgets.Add(travelBudget);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = travelBudget.Id }, travelBudget);
        }

        // PUT: api/TravelBudget/{id}
        // Updates an existing budget entry
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TravelBudget travelBudget)
        {
            if (id != travelBudget.Id) 
                return BadRequest();

            var existingBudget = await _context.TravelBudgets.FindAsync(id);
            if (existingBudget == null)
                return NotFound();

            existingBudget.Description = travelBudget.Description;
            existingBudget.Amount = travelBudget.Amount;
            existingBudget.UpdatedAt = DateTime.UtcNow;

            _context.Entry(existingBudget).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/TravelBudget/{id}
        // Deletes a specific budget entry
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var travelBudget = await _context.TravelBudgets.FindAsync(id);
            if (travelBudget == null) return NotFound();
            _context.TravelBudgets.Remove(travelBudget);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
