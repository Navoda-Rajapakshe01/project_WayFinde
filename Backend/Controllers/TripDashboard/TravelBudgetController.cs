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

        // GET: api/TravelBudget
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelBudget>>> Get() =>
            await _context.TravelBudgets.ToListAsync();

        // GET: api/TravelBudget/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelBudget>> Get(int id)
        {
            var travelBudget = await _context.TravelBudgets.FindAsync(id);
            return travelBudget == null ? NotFound() : Ok(travelBudget);
        }

        // POST: api/TravelBudget
        [HttpPost]
        public async Task<ActionResult<TravelBudget>> Post(TravelBudget travelBudget)
        {
            _context.TravelBudgets.Add(travelBudget);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = travelBudget.Id }, travelBudget);
        }

        // PUT: api/TravelBudget/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TravelBudget travelBudget)
        {
            if (id != travelBudget.Id) return BadRequest();
            _context.Entry(travelBudget).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/TravelBudget/{id}
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
