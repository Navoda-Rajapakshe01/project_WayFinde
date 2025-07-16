using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using Backend.DTO;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips.ToListAsync();
        }

        // GET: api/trips/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            var tripDto = new TripDetailsDto
            {
                Id = trip.Id,
                TripName = trip.Name,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                TripDistance = (double?)trip.TripDistance,
                TripTime = trip.TripTime.ToString(),
                TotalSpend = trip.TotalSpend,

                Places = trip.TripPlaces.Select(tp => new PlaceDto
                {
                    Id = tp.Place.Id,
                    Name = tp.Place.Name,
                    GoogleMapLink = tp.Place.GoogleMapLink!,
                    AvgTime = tp.Place.AvgTime!,
                    AvgSpend = tp.Place.AvgSpend,
                    Rating = null, // Rating property doesn't exist in PlacesToVisit model
                    HowManyRated = tp.Place.HowManyRated ?? 0,
                    MainImageUrl = tp.Place.MainImageUrl
                }).ToList()
            };

            return Ok(tripDto);
        }

        // PATCH: api/trips/{id} - New method for updating trip basic details
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchTrip(int id, [FromBody] PatchTripRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid request data" });

            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            // Update only the provided fields
            if (!string.IsNullOrEmpty(request.Name))
            {
                trip.Name = request.Name;
            }

            if (request.StartDate.HasValue)
            {
                trip.StartDate = request.StartDate.Value;
            }

            if (request.EndDate.HasValue)
            {
                trip.EndDate = request.EndDate.Value;
            }

            // Update the UpdatedAt timestamp
            trip.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = "Trip updated successfully",
                    trip = new {
                        id = trip.Id,
                        name = trip.Name,
                        startDate = trip.StartDate,
                        endDate = trip.EndDate,
                        updatedAt = trip.UpdatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating trip: {ex.Message}");
                return StatusCode(500, new { message = "Failed to update trip", detail = ex.Message });
            }
        }

        [HttpPut("update-trip")]
        public async Task<IActionResult> UpdateTrip([FromBody] UpdateTripRequest request)
        {
            if (request == null || request.TripId == 0)
                return BadRequest(new { message = "tripId is required" });

            var trip = await _context.Trips
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                    .AsTracking()
                .FirstOrDefaultAsync(t => t.Id == request.TripId);

            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            trip.Name = request.TripName ?? trip.Name;
            trip.TripDistance = request.TripDistance != null ? (decimal)request.TripDistance : trip.TripDistance;
            trip.TripTime = request.TripTime != null ? decimal.Parse(request.TripTime) : trip.TripTime;
            trip.TotalSpend = request.TotalSpend ?? trip.TotalSpend;
            trip.StartDate = request.StartDate ?? trip.StartDate;
            trip.EndDate = request.EndDate ?? trip.EndDate;
            trip.UserId = !string.IsNullOrEmpty(request.UserId) ? int.Parse(request.UserId) : trip.UserId;

            if (request.PlaceIds != null && request.PlaceIds.Any())
            {
                var toRemove = trip.TripPlaces
                    .Where(tp => tp != null && !request.PlaceIds.Contains(tp.PlaceId))
                    .ToList();

                foreach (var removeItem in toRemove)
                    trip.TripPlaces.Remove(removeItem);

                var existingPlaceIds = trip.TripPlaces?
                    .Where(tp => tp != null)
                    .Select(tp => tp.PlaceId)
                    .ToList() ?? new List<int>();

                var toAdd = request.PlaceIds.Except(existingPlaceIds).ToList();

                if (trip.TripPlaces == null)
                {
                    trip.TripPlaces = new List<TripPlace>();
                }
                foreach (var placeId in toAdd)
                {
                    trip.TripPlaces.Add(new TripPlace
                    {
                        TripId = trip.Id,
                        PlaceId = placeId
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Save failed: {ex.Message}");
                return StatusCode(500, new { message = "Save failed", detail = ex.Message });
            }

            var tripDto = new TripDetailsDto
            {
                Id = trip.Id,
                TripName = trip.Name,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                TripDistance = (double?)trip.TripDistance,
                TripTime = trip.TripTime.ToString(),
                TotalSpend = trip.TotalSpend,

                Places = trip.TripPlaces?
                    .Where(tp => tp?.Place != null)
                    .Select(tp => new PlaceDto
                    {
                        Id = tp.Place.Id,
                        Name = tp.Place.Name,
                        GoogleMapLink = tp.Place.GoogleMapLink!,
                        MainImageUrl = tp.Place.MainImageUrl
                    }).ToList() ?? new List<PlaceDto>()
            };

            return Ok(new { message = "Trip updated successfully", trip = tripDto });
        }

        public class GetTripByIdRequest
        {
            public int TripId { get; set; }
        }

        // New DTO for PATCH request
        public class PatchTripRequest
        {
            public string? Name { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        // ✅ FIXED: Unique route "all"
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _context.Trips
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                .ToListAsync();

            var result = trips.Select(trip => new
            {
                id = trip.Id,
                tripName = trip.Name,
                startDate = trip.StartDate,
                endDate = trip.EndDate,
                tripDistance = trip.TripDistance,
                tripTime = trip.TripTime,
                TotalSpend = trip.TotalSpend,

                userId = trip.UserId,
                Places = trip.TripPlaces.Select(tp => new PlaceDto
                {
                    Id = tp.Place.Id,
                    Name = tp.Place.Name,
                    GoogleMapLink = tp.Place.GoogleMapLink!,
                    AvgTime = tp.Place.AvgTime!,
                    AvgSpend = tp.Place.AvgSpend,
                    Rating = null,
                    HowManyRated = tp.Place.HowManyRated ?? 0,
                    MainImageUrl = tp.Place.MainImageUrl
                }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("search-users")]
        public async Task<ActionResult<IEnumerable<UserSearchDto>>> SearchUsers(string query)
        {
            var users = await _context.UserNew
                .Where(u => u.Username.Contains(query))
                .Select(u => new UserSearchDto
                {
                    Id = u.Id,
                    Username = u.Username
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("add-collaborator")]
        public async Task<IActionResult> AddCollaborator(int tripId, Guid userId)
        {
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound();
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}