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
        // Retrieves all travel‑budget records
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> GetTravelBudgets()
        {
            var budgets = await _context.TravelBudgets
                .Select(b => new TravelBudget
                {
                    Id          = b.Id,
                    Description = b.Description,
                    Amount      = b.Amount,
                    CreatedAt   = b.CreatedAt,
                    UpdatedAt   = b.UpdatedAt,
                    TripId      = b.TripId
                })
                .ToListAsync();

            return Ok(budgets);
        }

        // GET: api/TravelBudget/{id}
        // Retrieves a specific travel‑budget item by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelBudget>> GetTravelBudget(int id)
        {
            var budget = await _context.TravelBudgets
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        // GET: api/TravelBudget/trip/{tripId}
        // Retrieves all budget items belonging to a given trip
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> GetBudgetsByTrip(int tripId)
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

        // POST: api/TravelBudget
        // Creates a new travel‑budget entry
        [HttpPost]
        public async Task<ActionResult<TravelBudget>> PostTravelBudget(TravelBudget budget)
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
        // Updates an existing travel‑budget entry
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTravelBudget(int id, TravelBudget updatedBudget)
        {
            if (id != updatedBudget.Id)
                return BadRequest();

            var existingBudget = await _context.TravelBudgets.FindAsync(id);
            if (existingBudget == null)
                return NotFound();

            existingBudget.Description = updatedBudget.Description;
            existingBudget.Amount      = updatedBudget.Amount;
            existingBudget.UpdatedAt   = DateTime.UtcNow;

            _context.Entry(existingBudget).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TravelBudget/{id}
        // Deletes a specific travel‑budget entry
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
