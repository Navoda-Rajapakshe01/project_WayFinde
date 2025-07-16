using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Data
{
    [ApiController]
    [Route("api/trips")]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-trip")]
        public async Task<IActionResult> AddTrip([FromBody] TripCreateDto dto)
        {
            if (string.IsNullOrEmpty(dto.TripName))
                return BadRequest(new { message = "Validation failed", errors = new { Field = "TripName", Message = "The TripName field is required." } });

            if (dto.StartDate == default)
                return BadRequest(new { message = "Validation failed", errors = new { Field = "StartDate", Message = "The StartDate field is required and must be a valid date." } });

            if (dto.EndDate == default)
                return BadRequest(new { message = "Validation failed", errors = new { Field = "EndDate", Message = "The EndDate field is required and must be a valid date." } });

            if (string.IsNullOrEmpty(dto.UserId))
                return BadRequest(new { message = "Validation failed", errors = new { Field = "UserId", Message = "The UserId field is required." } });

            if (dto.PlaceIds == null || !dto.PlaceIds.Any())
                return BadRequest(new { message = "Validation failed", errors = new { Field = "PlaceIds", Message = "The PlaceIds field is required and must contain at least one place." } });

            var trip = new Trip
            {
                TripName = dto.TripName,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = dto.UserId,
                TripPlaces = dto.PlaceIds.Select(pid => new TripPlace { PlaceId = pid }).ToList()
            };

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Trip created successfully", tripId = trip.Id });
        }

        [HttpPost("getTripById")]
        public async Task<IActionResult> GetTripById([FromBody] GetTripByIdRequest request)
        {
            if (request == null || request.TripId == 0)
                return BadRequest(new { message = "tripId is required" });

            var trip = await _context.Trips
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                .FirstOrDefaultAsync(t => t.Id == request.TripId);

            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            var tripDto = new TripDetailsDto
            {
                Id = trip.Id,
                TripName = trip.TripName,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                TripDistance = trip.TripDistance,
                TripTime = trip.TripTime,
                TotalSpend = (decimal?)trip.TotalSpend,

                Places = trip.TripPlaces.Select(tp => new PlaceDto
                {
                    Id = tp.Place.Id,
                    Name = tp.Place.Name,
                    GoogleMapLink = tp.Place.GoogleMapLink!,
                    AvgTime = tp.Place.AvgTime!,
                    AvgSpend = tp.Place.AvgSpend,
                    MainImageUrl = tp.Place.MainImageUrl
                }).ToList()
            };

            return Ok(tripDto);
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

            trip.TripName = request.TripName ?? trip.TripName;
            trip.TripDistance = request.TripDistance ?? trip.TripDistance;
            trip.TripTime = request.TripTime ?? trip.TripTime;
            trip.TotalSpend = request.TotalSpend ?? trip.TotalSpend;
            trip.StartDate = request.StartDate ?? trip.StartDate;
            trip.EndDate = request.EndDate ?? trip.EndDate;
            trip.UserId = request.UserId ?? trip.UserId;

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
                TripName = trip.TripName,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                TripDistance = trip.TripDistance,
                TripTime = trip.TripTime,
                TotalSpend = (decimal?)trip.TotalSpend,

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

        [HttpGet]
        public async Task<IActionResult> GetAllTrips()
        {
            var trips = await _context.Trips
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                .ToListAsync();

            var result = trips.Select(trip => new
            {
                id = trip.Id,
                tripName = trip.TripName,
                startDate = trip.StartDate,
                endDate = trip.EndDate,
                tripDistance = trip.TripDistance,
                tripTime = trip.TripTime,
                TotalSpend = (decimal?)trip.TotalSpend,

                userId = trip.UserId,
                Places = trip.TripPlaces.Select(tp => new PlaceDto
                {
                    Id = tp.Place.Id,
                    Name = tp.Place.Name,
                    GoogleMapLink = tp.Place.GoogleMapLink!,
                    AvgTime = tp.Place.AvgTime!,
                    AvgSpend = tp.Place.AvgSpend,
                    MainImageUrl = tp.Place.MainImageUrl
                }).ToList()
            });

            return Ok(result);
        }



        [HttpGet("search-users")]
        public async Task<ActionResult<IEnumerable<UserSearchDto>>> SearchUsers(string query)
        {
            var users = await _context.UsersNew  
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
            if (trip == null) return NotFound("Trip not found.");

            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null) return NotFound("User not found.");

            var alreadyExists = await _context.TripCollaborator
                .AnyAsync(tc => tc.TripId == tripId && tc.UserId == userId);

            if (alreadyExists) return BadRequest("User already added as collaborator.");

            var collaborator = new TripCollaborator
            {
                TripId = tripId,
                UserId = userId
            };

            _context.TripCollaborator.Add(collaborator);
            await _context.SaveChangesAsync();

            return Ok("Collaborator added.");
        }

        [HttpGet("get-collaborators")]
        public async Task<IActionResult> GetCollaborators(int tripId)
        {
            var collaborators = await _context.TripCollaborator
                .Where(tc => tc.TripId == tripId)
                .Select(tc => new
                {
                    tc.User.Id,
                    tc.User.Username
                })
                .ToListAsync();

            return Ok(collaborators);
        }




    }
}
