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

        public TravelBudgetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TravelBudget
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> GetTravelBudgets()
        {
            var budgets = await _context.TravelBudgets
                .Include(b => b.Trip) // Include Trip if needed for view
                .Select(b => new
                {
                    b.Id,
                    b.Description,
                    b.Amount,
                    b.CreatedAt,
                    b.UpdatedAt,
                    b.TripId
                })
                .ToListAsync();

            return Ok(budgets);
        }

        // GET: api/TravelBudget/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelBudget>> GetTravelBudget(int id)
        {
            var budget = await _context.TravelBudgets
                .Include(b => b.Trip)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        // GET: api/TravelBudget/trip/{tripId}
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> GetBudgetsByTrip(int tripId)
        {
            var tripExists = await _context.Trips.AnyAsync(t => t.Id == tripId);
            if (!tripExists)
                return NotFound("Trip not found");

            var budgets = await _context.TravelBudgets
                .Where(b => b.TripId == tripId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(budgets);
        }

        // POST: api/TravelBudget
        [HttpPost]
        public async Task<ActionResult<TravelBudget>> PostTravelBudget([FromBody] TravelBudget budget)
        {
            var trip = await _context.Trips.FindAsync(budget.TripId);
            if (trip == null)
                return BadRequest("Invalid TripId");

            budget.CreatedAt = DateTime.UtcNow;
            budget.UpdatedAt = DateTime.UtcNow;

            _context.TravelBudgets.Add(budget);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTravelBudget), new { id = budget.Id }, budget);
        }

        // PUT: api/TravelBudget/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTravelBudget(int id, [FromBody] TravelBudget updatedBudget)
        {
            if (id != updatedBudget.Id)
                return BadRequest("ID mismatch");

            var existingBudget = await _context.TravelBudgets.FindAsync(id);
            if (existingBudget == null)
                return NotFound();

            existingBudget.Description = updatedBudget.Description;
            existingBudget.Amount = updatedBudget.Amount;
            existingBudget.UpdatedAt = DateTime.UtcNow;

            _context.Entry(existingBudget).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TravelBudget/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTravelBudget(int id)
        {
            var budget = await _context.TravelBudgets.FindAsync(id);
            if (budget == null)
                return NotFound();

            _context.TravelBudgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
