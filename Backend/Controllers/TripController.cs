using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TripsController> _logger;

        public TripsController(AppDbContext context, ILogger<TripsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            try
            {
                var trips = await _context.Trips
                    .Select(t => new Trip
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Description = t.Description,
                        StartDate = t.StartDate,
                        EndDate = t.EndDate,
                        TotalSpend = t.TotalSpend,
                        TripDistance = t.TripDistance,
                        TripTime = t.TripTime,
                        UserId = t.UserId,
                        CreatedAt = t.CreatedAt,
                        UpdatedAt = t.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(trips);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting trips: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving trips", error = ex.Message });
            }
        }

        // GET: api/trips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(id);

                if (trip == null)
                {
                    return NotFound(new { message = $"Trip with ID {id} not found" });
                }

                return trip;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting trip {id}: {ex.Message}");
                return StatusCode(500, new { message = $"Error retrieving trip {id}", error = ex.Message });
            }
        }

        // POST: api/trips
        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip([FromBody] Trip trip)
        {
            try
            {
                _logger.LogInformation($"Received trip data: {JsonSerializer.Serialize(trip)}");

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning($"Invalid model state: {JsonSerializer.Serialize(ModelState)}");
                    return BadRequest(ModelState);
                }

                // Validate dates
                if (trip.EndDate < trip.StartDate)
                {
                    _logger.LogWarning($"Invalid dates: Start={trip.StartDate}, End={trip.EndDate}");
                    return BadRequest(new { message = "End date cannot be earlier than start date" });
                }

                // Validate numeric values
                if (trip.TotalSpend < 0 || trip.TripDistance < 0 || trip.TripTime < 0)
                {
                    _logger.LogWarning($"Invalid numeric values: TotalSpend={trip.TotalSpend}, Distance={trip.TripDistance}, Time={trip.TripTime}");
                    return BadRequest(new { message = "Numeric values cannot be negative" });
                }

                // Ensure decimal values are properly formatted
                trip.TotalSpend = Math.Round(trip.TotalSpend, 2);
                trip.TripDistance = Math.Round(trip.TripDistance, 2);
                trip.TripTime = Math.Round(trip.TripTime, 2);

                // Check if user exists
                var userExists = await _context.Users.AnyAsync(u => u.Id == trip.UserId);
                if (!userExists)
                {
                    _logger.LogWarning($"User not found: UserId={trip.UserId}");
                    return BadRequest(new { message = "Invalid user ID" });
                }

                _context.Trips.Add(trip);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Trip created successfully with ID: {trip.Id}");
                return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError($"Database error while creating trip: {ex.Message}");
                _logger.LogError($"Inner exception: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Database error occurred while creating trip", error = ex.InnerException?.Message ?? ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating trip: {ex.Message}");
                return StatusCode(500, new { message = "Error creating trip", error = ex.Message });
            }
        }

        // PUT: api/trips/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, Trip trip)
        {
            if (id != trip.Id)
            {
                return BadRequest(new { message = "Trip ID mismatch" });
            }

            try
            {
                // Ensure decimal values are properly formatted
                trip.TotalSpend = Math.Round(trip.TotalSpend, 2);
                trip.TripDistance = Math.Round(trip.TripDistance, 2);
                trip.TripTime = Math.Round(trip.TripTime, 2);

                _context.Entry(trip).State = EntityState.Modified;
                _context.Entry(trip).Property(x => x.CreatedAt).IsModified = false;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripExists(id))
                {
                    return NotFound(new { message = $"Trip with ID {id} not found" });
                }
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating trip {id}: {ex.Message}");
                return StatusCode(500, new { message = $"Error updating trip {id}", error = ex.Message });
            }
        }

        // DELETE: api/trips/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(id);
                if (trip == null)
                {
                    return NotFound(new { message = $"Trip with ID {id} not found" });
                }

                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting trip {id}: {ex.Message}");
                return StatusCode(500, new { message = $"Error deleting trip {id}", error = ex.Message });
            }
        }

        private bool TripExists(int id)
        {
            return _context.Trips.Any(e => e.Id == id);
        }
    }
} 