using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleReservationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleReservationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleReservation>>> GetVehicleReservations()
        {
            return await _context.VehicleReservations
                .Include(vr => vr.Vehicle)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleReservation>> GetVehicleReservation(int id)
        {
            var vehicleReservation = await _context.VehicleReservations
                .Include(vr => vr.Vehicle)
                .FirstOrDefaultAsync(vr => vr.Id == id);

            if (vehicleReservation == null)
                return NotFound();

            return vehicleReservation;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<VehicleReservation>>> GetVehicleReservationsByVehicleId(int vehicleId)
        {
            return await _context.VehicleReservations
                .Where(vr => vr.VehicleId == vehicleId)
                .Include(vr => vr.Vehicle)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<VehicleReservation>> CreateVehicleReservation(VehicleReservation vehicleReservation)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleReservation.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            if (!vehicle.IsAvailable)
                return BadRequest("Vehicle is not available for reservation");

            // Set vehicle as unavailable
            vehicle.IsAvailable = false;
            _context.Entry(vehicle).State = EntityState.Modified;

            _context.VehicleReservations.Add(vehicleReservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVehicleReservation), new { id = vehicleReservation.Id }, vehicleReservation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicleReservation(int id, VehicleReservation vehicleReservation)
        {
            if (id != vehicleReservation.Id)
                return BadRequest();

            var vehicle = await _context.Vehicles.FindAsync(vehicleReservation.VehicleId);
            if (vehicle == null)
                return BadRequest("Vehicle not found");

            _context.Entry(vehicleReservation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleReservationExists(id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicleReservation(int id)
        {
            var vehicleReservation = await _context.VehicleReservations
                .Include(vr => vr.Vehicle)
                .FirstOrDefaultAsync(vr => vr.Id == id);

            if (vehicleReservation == null)
                return NotFound();

            // Set vehicle as available again
            if (vehicleReservation.Vehicle != null)
            {
                vehicleReservation.Vehicle.IsAvailable = true;
                _context.Entry(vehicleReservation.Vehicle).State = EntityState.Modified;
            }

            _context.VehicleReservations.Remove(vehicleReservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehicleReservationExists(int id)
        {
            return _context.VehicleReservations.Any(e => e.Id == id);
        }
    }
} 