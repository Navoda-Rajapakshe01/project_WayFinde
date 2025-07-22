using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleReviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleReview>>> GetVehicleReviews()
        {
            return await _context.VehicleReviews
                .Include(vr => vr.Vehicle)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleReview>> GetVehicleReview(int id)
        {
            var vehicleReview = await _context.VehicleReviews
                .Include(vr => vr.Vehicle)
                .FirstOrDefaultAsync(vr => vr.Id == id);

            if (vehicleReview == null)
                return NotFound();

            return vehicleReview;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<VehicleReview>>> GetVehicleReviewsByVehicleId(int vehicleId)
        {
            return await _context.VehicleReviews
                .Where(vr => vr.VehicleId == vehicleId)
                .Include(vr => vr.Vehicle)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<VehicleReview>> CreateVehicleReview(VehicleReview vehicleReview)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleReview.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            _context.VehicleReviews.Add(vehicleReview);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleReview), new { id = vehicleReview.Id }, vehicleReview);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicleReview(int id, VehicleReview vehicleReview)
        {
            if (id != vehicleReview.Id)
                return BadRequest();

            var vehicle = await _context.Vehicles.FindAsync(vehicleReview.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            _context.Entry(vehicleReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleReviewExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicleReview(int id)
        {
            var vehicleReview = await _context.VehicleReviews.FindAsync(id);
            if (vehicleReview == null)
                return NotFound();

            _context.VehicleReviews.Remove(vehicleReview);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehicleReviewExists(int id)
        {
            return _context.VehicleReviews.Any(e => e.Id == id);
        }
    }
} 