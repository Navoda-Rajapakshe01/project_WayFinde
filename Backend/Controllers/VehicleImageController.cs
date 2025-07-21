using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleImageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleImageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleImage>>> GetVehicleImages()
        {
            return await _context.VehicleImages.Include(vi => vi.Vehicle).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleImage>> GetVehicleImage(int id)
        {
            var vehicleImage = await _context.VehicleImages
                .Include(vi => vi.Vehicle)
                .FirstOrDefaultAsync(vi => vi.Id == id);

            if (vehicleImage == null)
                return NotFound();

            return vehicleImage;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<VehicleImage>>> GetVehicleImagesByVehicleId(int vehicleId)
        {
            return await _context.VehicleImages
                .Where(vi => vi.VehicleId == vehicleId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<VehicleImage>> CreateVehicleImage(VehicleImage vehicleImage)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleImage.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            _context.VehicleImages.Add(vehicleImage);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleImage), new { id = vehicleImage.Id }, vehicleImage);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicleImage(int id, VehicleImage vehicleImage)
        {
            if (id != vehicleImage.Id)
                return BadRequest();

            var vehicle = await _context.Vehicles.FindAsync(vehicleImage.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            _context.Entry(vehicleImage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleImageExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicleImage(int id)
        {
            var vehicleImage = await _context.VehicleImages.FindAsync(id);
            if (vehicleImage == null)
                return NotFound();

            _context.VehicleImages.Remove(vehicleImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehicleImageExists(int id)
        {
            return _context.VehicleImages.Any(e => e.Id == id);
        }
    }
} 