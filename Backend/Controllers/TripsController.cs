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

            if (dto.UserId == Guid.Empty)

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
                        .ThenInclude(p => p.Reviews) // Include Reviews here
                .Include(t => t.TripDates)
                .FirstOrDefaultAsync(t => t.Id == request.TripId);

            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            var tripDto = new TripDetailsDto
            {
                Id = trip.Id,
                TripName = trip.TripName,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
            
                Places = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .Select(tp =>
                    {
                        var tripDateForPlace = trip.TripDates.FirstOrDefault(td => td.PlaceId == tp.PlaceId);
                        var reviews = tp.Place.Reviews;

                        return new PlaceDto
                        {
                            Id = tp.Place.Id,
                            Name = tp.Place.Name,
                            GoogleMapLink = tp.Place.GoogleMapLink,
                            AvgTime = tp.Place.AvgTime,
                            AvgSpend = tp.Place.AvgSpend,
                            Rating = reviews.Any() ? reviews.Average(r => r.Rating) : (double?)null,
                            MainImageUrl = tp.Place.MainImageUrl,
                            District = tp.Place.District != null ? new DistrictWithPlacesCountDTO
                            {
                                Id = tp.Place.District.Id,
                                Name = tp.Place.District.Name,
                                SubTitle = tp.Place.District.SubTitle,
                                ImageUrl = tp.Place.District.ImageUrl
                            } : null,
                            StartDate = tripDateForPlace?.StartDate,
                            EndDate = tripDateForPlace?.EndDate
                        };
                    })
                    .ToList()
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

            // Update trip fields as you currently do
            trip.TripName = request.TripName ?? trip.TripName;
          
            trip.StartDate = request.StartDate ?? trip.StartDate;
            trip.EndDate = request.EndDate ?? trip.EndDate;
            trip.UserId = request.UserId ?? trip.UserId;

            if (request.PlaceIds != null && request.PlaceIds.Any())
            {
                // Remove places not in new list
                var toRemove = trip.TripPlaces
                    .Where(tp => tp != null && !request.PlaceIds.Contains(tp.PlaceId))
                    .ToList();

                foreach (var removeItem in toRemove)
                    trip.TripPlaces.Remove(removeItem);

                // Existing places
                var existingPlaceIds = trip.TripPlaces?
                    .Where(tp => tp != null)
                    .Select(tp => tp.PlaceId)
                    .ToList() ?? new List<int>();

                // Add new places that are not yet linked
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
                        PlaceId = placeId,
                        Order = request.PlaceIds.IndexOf(placeId)  // Set order on add
                    });
                }

                // Update the Order for all places to reflect the frontend order
                foreach (var tp in trip.TripPlaces)
                {
                    tp.Order = request.PlaceIds.IndexOf(tp.PlaceId);
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
              

                Places = trip.TripPlaces?
                    .Where(tp => tp?.Place != null)
                    .OrderBy(tp => tp.Order)  // Return places ordered by the saved order
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



        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTripsByUserId(Guid userId)
        {
            if (userId == Guid.Empty)
                return BadRequest("UserId is required.");


            var trips = await _context.Trips
                .Where(t => t.UserId == userId)
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                        .ThenInclude(p => p.Reviews)          // ← include reviews
                .Include(t => t.TripDates)
                .ToListAsync();

            var result = trips.Select(trip => new
            {
                id = trip.Id,
                tripName = trip.TripName,
                startDate = trip.StartDate,
                endDate = trip.EndDate,
                
                userId = trip.UserId,
                places = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .Select(tp =>
                    {
                        var tripDateForPlace = trip.TripDates
                            .FirstOrDefault(td => td.PlaceId == tp.PlaceId);

                        var reviews = tp.Place.Reviews;
                        var avgRating = reviews.Any()
                            ? reviews.Average(r => r.Rating)
                            : (double?)null;

                        return new PlaceDto
                        {
                            Id = tp.Place.Id,
                            Name = tp.Place.Name,
                            GoogleMapLink = tp.Place.GoogleMapLink,
                            AvgTime = tp.Place.AvgTime,
                            AvgSpend = tp.Place.AvgSpend,
                            Rating = avgRating,               // ← dynamic average
                            MainImageUrl = tp.Place.MainImageUrl,
                            District = tp.Place.District != null ? new DistrictWithPlacesCountDTO
                            {
                                Id = tp.Place.District.Id,
                                Name = tp.Place.District.Name,
                                SubTitle = tp.Place.District.SubTitle,
                                ImageUrl = tp.Place.District.ImageUrl
                            } : null,
                            StartDate = tripDateForPlace?.StartDate,
                            EndDate = tripDateForPlace?.EndDate
                        };
                    })
                    .ToList()
            });

            return Ok(result);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTripById(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                        .ThenInclude(p => p.Reviews)   // include reviews
                .Include(t => t.TripDates)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
                return NotFound(new { message = "Trip not found" });

            var tripDto = new TripDetailsDto
            {
                Id = trip.Id,
                TripName = trip.TripName,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
               

                Places = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .Select(tp =>
                    {
                        var tripDateForPlace = trip.TripDates
                            .FirstOrDefault(td => td.PlaceId == tp.PlaceId);

                        var reviews = tp.Place.Reviews;
                        var avgRating = reviews.Any()
                            ? reviews.Average(r => r.Rating)
                            : (double?)null;

                        return new PlaceDto
                        {
                            Id = tp.Place.Id,
                            Name = tp.Place.Name,
                            GoogleMapLink = tp.Place.GoogleMapLink,
                            AvgTime = tp.Place.AvgTime,
                            AvgSpend = tp.Place.AvgSpend,
                            Rating = avgRating,               // dynamic average
                            MainImageUrl = tp.Place.MainImageUrl,
                            District = tp.Place.District != null ? new DistrictWithPlacesCountDTO
                            {
                                Id = tp.Place.District.Id,
                                Name = tp.Place.District.Name,
                                SubTitle = tp.Place.District.SubTitle,
                                ImageUrl = tp.Place.District.ImageUrl
                            } : null,
                            StartDate = tripDateForPlace?.StartDate,
                            EndDate = tripDateForPlace?.EndDate
                        };
                    })
                    .ToList()
            };

            return Ok(tripDto);
        }




        [HttpGet("search-users")]
        public async Task<ActionResult<IEnumerable<UserSearchDto>>> SearchUsers(string query)
        {
            var users = await _context.UsersNew
                .Where(u =>
                    u.Role == "NormalUser" && (  // ✅ Filter only normal users
                    u.Username.Contains(query) ||
                    u.ContactEmail.Contains(query))
                    )
                .Select(u => new UserSearchDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.ContactEmail,
                    ProfilePictureUrl = u.ProfilePictureUrl
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
            // Step 1: Get the trip with the owner info
            var trip = await _context.Trips
                .Include(t => t.User)  // Include the owner (UserNew)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip == null)
                return NotFound("Trip not found.");

            if (trip.User == null)
                return StatusCode(500, "Owner user info is missing.");

            // Step 2: Build the owner object
            var ownerDto = new
            {
                Id = trip.User.Id,
                Username = trip.User.Username,
                Email = trip.User.ContactEmail,
                ProfilePictureUrl = trip.User.ProfilePictureUrl,
                IsOwner = true
            };

            // Step 3: Get collaborators with their user info
            var collaborators = await _context.TripCollaborator
                .Where(tc => tc.TripId == tripId)
                .Include(tc => tc.User) // include User info for collaborators
                .Select(tc => new
                {
                    Id = tc.User.Id,
                    Username = tc.User.Username,
                    Email = tc.User.ContactEmail,
                    ProfilePictureUrl = tc.User.ProfilePictureUrl,
                    IsOwner = false
                })
                .ToListAsync();

            // Step 4: Combine and return result
            var result = new[] { ownerDto }.Concat(collaborators);

            return Ok(result);
        }



        [HttpGet("collaborative")]
        public async Task<IActionResult> GetCollaborativeTrips(Guid userId)
        {
            var tripCollaborations = await _context.TripCollaborator
                .Include(tc => tc.Trip)
                    .ThenInclude(t => t.TripPlaces)
                        .ThenInclude(tp => tp.Place)
                            .ThenInclude(p => p.Reviews)
                .Include(tc => tc.Trip)
                    .ThenInclude(t => t.TripDates)
                .Where(tc => tc.UserId == userId && tc.IsAccepted == true)
                .ToListAsync();

            var result = tripCollaborations.Select(tc =>
            {
                var trip = tc.Trip;

                var firstPlace = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .FirstOrDefault()?.Place;

                decimal avgSpend = trip.TripPlaces
                    .Where(tp => tp.Place != null && tp.Place.AvgSpend.HasValue)
                    .Select(tp => tp.Place.AvgSpend ?? 0)
                    .DefaultIfEmpty(0)
                    .Average();

                return new
                {
                    id = trip.Id,
                    tripName = trip.TripName,
                    startDate = trip.StartDate,
                    endDate = trip.EndDate,
                    userId = trip.UserId,
                    avgSpend = avgSpend,
                    thumbnail = firstPlace?.MainImageUrl ?? "https://via.placeholder.com/120",
                    places = trip.TripPlaces
                        .OrderBy(tp => tp.Order)
                        .Select(tp =>
                        {
                            var tripDate = trip.TripDates
                                .FirstOrDefault(td => td.PlaceId == tp.PlaceId);

                            var reviews = tp.Place.Reviews;
                            var avgRating = reviews.Any()
                                ? reviews.Average(r => r.Rating)
                                : (double?)null;

                            return new
                            {
                                id = tp.Place.Id,
                                name = tp.Place.Name,
                                googleMapLink = tp.Place.GoogleMapLink,
                                avgTime = tp.Place.AvgTime,
                                avgSpend = tp.Place.AvgSpend,
                                rating = avgRating,
                                mainImageUrl = tp.Place.MainImageUrl,
                                district = tp.Place.District != null ? new
                                {
                                    id = tp.Place.District.Id,
                                    name = tp.Place.District.Name,
                                    subTitle = tp.Place.District.SubTitle,
                                    imageUrl = tp.Place.District.ImageUrl
                                } : null,
                                startDate = tripDate?.StartDate,
                                endDate = tripDate?.EndDate
                            };
                        })
                        .ToList()
                };
            });

            return Ok(result);
        }




        [HttpGet("invitations")]
        public async Task<IActionResult> GetInvitations(Guid userId)
        {
            var invitations = await _context.TripCollaborator
                .Include(tc => tc.Trip)
                    .ThenInclude(t => t.User) 
                .Where(tc => tc.UserId == userId && tc.IsAccepted == false)
                .Select(tc => new {
                    TripId = tc.TripId,
                    TripName = tc.Trip.TripName,
                    StartDate = tc.Trip.StartDate,
                    InvitedOn = tc.AddedAt,
                    OwnerName = tc.Trip.User.Username 
                })
                .ToListAsync();

            return Ok(invitations);
        }


        [HttpPost("respond-invitation")]
        public async Task<IActionResult> RespondToInvitation(int tripId, Guid userId, bool accept)
        {
            var record = await _context.TripCollaborator
                .FirstOrDefaultAsync(tc => tc.TripId == tripId && tc.UserId == userId);

            if (record == null)
                return NotFound("Invitation not found.");

            if (accept)
                record.IsAccepted = true;
            else
                _context.TripCollaborator.Remove(record);

            await _context.SaveChangesAsync();
            return Ok("Response recorded.");
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null) return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("save-trip-dates")]
        public async Task<IActionResult> SaveTripDates([FromBody] List<TripDateDto> tripDatesDto)
        {
            try
            {
                if (tripDatesDto == null || !tripDatesDto.Any())
                    return BadRequest(new { message = "No trip dates provided" });

                var tripId = tripDatesDto[0].TripId;
                if (tripDatesDto.Any(td => td.TripId != tripId))
                    return BadRequest(new { message = "All tripDates must belong to the same TripId" });

                var existingTripDates = await _context.TripDate
                    .Where(td => td.TripId == tripId)
                    .ToListAsync();

                _context.TripDate.RemoveRange(existingTripDates);

                foreach (var tdDto in tripDatesDto)
                {
                    var tripDate = new TripDate
                    {
                        TripId = tdDto.TripId,
                        PlaceId = tdDto.PlaceId,
                        StartDate = tdDto.StartDate,
                        EndDate = tdDto.EndDate
                    };

                    _context.TripDate.Add(tripDate);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Trip dates saved successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine("SaveTripDates ERROR: " + ex.Message);
                return StatusCode(500, new { message = "Something went wrong", detail = ex.Message });
            }
        }

        [HttpGet("user-preview/{userId}")]
        public async Task<IActionResult> GetTripPreviewsByUserId(Guid userId)
        {
            if (userId == Guid.Empty)
                return BadRequest("UserId is required.");


            var trips = await _context.Trips
                .Where(t => t.UserId == userId)
                .Include(t => t.TripPlaces)
                    .ThenInclude(tp => tp.Place)
                .Include(t => t.TripDates)
                .Include(t => t.User) // Include the owner
                .ToListAsync();

            var result = trips.Select(trip =>
            {
                var firstPlace = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .FirstOrDefault()?.Place;

                decimal avgSpend = trip.TripPlaces
                    .Where(tp => tp.Place != null && tp.Place.AvgSpend.HasValue)
                    .Select(tp => tp.Place.AvgSpend ?? 0)
                    .DefaultIfEmpty(0)
                    .Average();

                var places = trip.TripPlaces
                    .OrderBy(tp => tp.Order)
                    .Select(tp => new
                    {
                        id = tp.Place?.Id,
                        name = tp.Place?.Name ?? "N/A",
                        order = tp.Order
                    })
                    .ToList();

                // Owner info
                var owner = trip.User != null ? new
                {
                    id = trip.User.Id,
                    username = trip.User.Username,
                    email = trip.User.ContactEmail,
                    profilePictureUrl = trip.User.ProfilePictureUrl
                } : null;

                return new
                {
                    id = trip.Id,
                    tripName = trip.TripName,
                    startDate = trip.StartDate,
                    endDate = trip.EndDate,
                    thumbnail = firstPlace?.MainImageUrl ?? "https://via.placeholder.com/120",
                    startLocation = firstPlace?.Name ?? "N/A",
                    avgSpend = avgSpend,
                    places = places,
                    userId = trip.UserId,
                    owner = owner
                };
            });

            return Ok(result);
        }









    }
}
