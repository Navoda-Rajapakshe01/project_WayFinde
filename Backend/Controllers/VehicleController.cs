using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Images)
                .Include(v => v.Reviews)
                .ToListAsync();

            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Images)
                .Include(v => v.Reviews)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound();

            return Ok(vehicle);
        }

        [HttpPost("{id}/reviews")]
        public async Task<ActionResult> AddReview(int id, VehicleReview review)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            review.VehicleId = id;
            _context.VehicleReviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(review);
        }

        [HttpPost("{id}/reserve")]
        public async Task<ActionResult> ReserveVehicle(int id, VehicleReservation reservation)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null || !vehicle.IsAvailable)
                return BadRequest("Vehicle not available");

            reservation.VehicleId = id;
            _context.VehicleReservations.Add(reservation);

            // Optional: mark vehicle unavailable
            vehicle.IsAvailable = false;
            await _context.SaveChangesAsync();

            return Ok(reservation);
        }
    }
}