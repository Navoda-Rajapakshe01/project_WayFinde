using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripDateController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripDateController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tripdate
        [HttpGet]
        public async Task<IActionResult> GetAllTripDates()
        {
            var tripDates = await _context.TripDate
                .Include(td => td.Trip)
                .Include(td => td.Place)
                .Select(td => new TripDateResponseDto
                {
                    Id = td.Id,
                    TripId = td.TripId,
                    TripName = td.Trip.Name,
                    PlaceId = td.PlaceId,
                    PlaceName = td.Place.Name,
                    StartDate = td.StartDate,
                    EndDate = td.EndDate
                })
                .ToListAsync();

            return Ok(tripDates);
        }

        // GET: api/tripdate/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTripDate(int id)
        {
            var tripDate = await _context.TripDate
                .Include(td => td.Trip)
                .Include(td => td.Place)
                .FirstOrDefaultAsync(td => td.Id == id);

            if (tripDate == null)
                return NotFound(new { message = "TripDate not found" });

            var result = new TripDateResponseDto
            {
                Id = tripDate.Id,
                TripId = tripDate.TripId,
                TripName = tripDate.Trip.Name,
                PlaceId = tripDate.PlaceId,
                PlaceName = tripDate.Place.Name,
                StartDate = tripDate.StartDate,
                EndDate = tripDate.EndDate
            };

            return Ok(result);
        }

        // GET: api/tripdate/trip/{tripId}
        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetTripDatesByTrip(int tripId)
        {
            var tripDates = await _context.TripDate
                .Include(td => td.Trip)
                .Include(td => td.Place)
                .Where(td => td.TripId == tripId)
                .Select(td => new TripDateResponseDto
                {
                    Id = td.Id,
                    TripId = td.TripId,
                    TripName = td.Trip.Name,
                    PlaceId = td.PlaceId,
                    PlaceName = td.Place.Name,
                    StartDate = td.StartDate,
                    EndDate = td.EndDate
                })
                .ToListAsync();

            return Ok(tripDates);
        }

        // GET: api/tripdate/place/{placeId}
        [HttpGet("place/{placeId}")]
        public async Task<IActionResult> GetTripDatesByPlace(int placeId)
        {
            var tripDates = await _context.TripDate
                .Include(td => td.Trip)
                .Include(td => td.Place)
                .Where(td => td.PlaceId == placeId)
                .Select(td => new TripDateResponseDto
                {
                    Id = td.Id,
                    TripId = td.TripId,
                    TripName = td.Trip.Name,
                    PlaceId = td.PlaceId,
                    PlaceName = td.Place.Name,
                    StartDate = td.StartDate,
                    EndDate = td.EndDate
                })
                .ToListAsync();

            return Ok(tripDates);
        }

        // POST: api/tripdate
        [HttpPost]
        public async Task<IActionResult> CreateTripDate([FromBody] TripDateCreateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "TripDate data is required" });

            if (dto.TripId <= 0)
                return BadRequest(new { message = "Valid TripId is required" });

            if (dto.PlaceId <= 0)
                return BadRequest(new { message = "Valid PlaceId is required" });

            if (dto.StartDate >= dto.EndDate)
                return BadRequest(new { message = "StartDate must be before EndDate" });

            // Check if trip exists
            var trip = await _context.Trips.FindAsync(dto.TripId);
            if (trip == null)
                return BadRequest(new { message = "Trip not found" });

            // Check if place exists
            var place = await _context.PlacesToVisit.FindAsync(dto.PlaceId);
            if (place == null)
                return BadRequest(new { message = "Place not found" });

            // Check if trip date already exists for this trip and place
            var existingTripDate = await _context.TripDate
                .FirstOrDefaultAsync(td => td.TripId == dto.TripId && td.PlaceId == dto.PlaceId);

            if (existingTripDate != null)
                return BadRequest(new { message = "TripDate already exists for this trip and place" });

            var tripDate = new TripDate
            {
                TripId = dto.TripId,
                PlaceId = dto.PlaceId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _context.TripDate.Add(tripDate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTripDate), new { id = tripDate.Id }, tripDate);
        }

        // PUT: api/tripdate/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTripDate(int id, [FromBody] TripDateUpdateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "TripDate data is required" });

            var tripDate = await _context.TripDate.FindAsync(id);
            if (tripDate == null)
                return NotFound(new { message = "TripDate not found" });

            // Validate dates if provided
            if (dto.StartDate.HasValue && dto.EndDate.HasValue)
            {
                if (dto.StartDate.Value >= dto.EndDate.Value)
                    return BadRequest(new { message = "StartDate must be before EndDate" });
            }

            // Update properties
            if (dto.StartDate.HasValue)
                tripDate.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue)
                tripDate.EndDate = dto.EndDate.Value;

            await _context.SaveChangesAsync();

            return Ok(new { message = "TripDate updated successfully", tripDate });
        }

        // DELETE: api/tripdate/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripDate(int id)
        {
            var tripDate = await _context.TripDate.FindAsync(id);
            if (tripDate == null)
                return NotFound(new { message = "TripDate not found" });

            _context.TripDate.Remove(tripDate);
            await _context.SaveChangesAsync();

            return Ok(new { message = "TripDate deleted successfully" });
        }

        // DELETE: api/tripdate/trip/{tripId}
        [HttpDelete("trip/{tripId}")]
        public async Task<IActionResult> DeleteTripDatesByTrip(int tripId)
        {
            var tripDates = await _context.TripDate
                .Where(td => td.TripId == tripId)
                .ToListAsync();

            if (!tripDates.Any())
                return NotFound(new { message = "No TripDates found for this trip" });

            _context.TripDate.RemoveRange(tripDates);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Deleted {tripDates.Count} TripDates for trip {tripId}" });
        }

        // POST: api/tripdate/bulk
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateBulkTripDates([FromBody] List<TripDateCreateDto> dtos)
        {
            if (dtos == null || !dtos.Any())
                return BadRequest(new { message = "TripDate data is required" });

            var tripId = dtos[0].TripId;
            if (dtos.Any(d => d.TripId != tripId))
                return BadRequest(new { message = "All TripDates must belong to the same trip" });

            // Check if trip exists
            var trip = await _context.Trips.FindAsync(tripId);
            if (trip == null)
                return BadRequest(new { message = "Trip not found" });

            // Validate all places exist
            var placeIds = dtos.Select(d => d.PlaceId).Distinct().ToList();
            var places = await _context.PlacesToVisit
                .Where(p => placeIds.Contains(p.Id))
                .ToListAsync();

            if (places.Count != placeIds.Count)
                return BadRequest(new { message = "One or more places not found" });

            // Remove existing trip dates for this trip
            var existingTripDates = await _context.TripDate
                .Where(td => td.TripId == tripId)
                .ToListAsync();

            _context.TripDate.RemoveRange(existingTripDates);

            // Add new trip dates
            var tripDates = dtos.Select(dto => new TripDate
            {
                TripId = dto.TripId,
                PlaceId = dto.PlaceId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            }).ToList();

            _context.TripDate.AddRange(tripDates);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Created {tripDates.Count} TripDates for trip {tripId}" });
        }
    }

    // DTOs for TripDate operations
    public class TripDateCreateDto
    {
        public int TripId { get; set; }
        public int PlaceId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class TripDateUpdateDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class TripDateResponseDto
    {
        public int Id { get; set; }
        public int TripId { get; set; }
        public string TripName { get; set; }
        public int PlaceId { get; set; }
        public string PlaceName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
} 