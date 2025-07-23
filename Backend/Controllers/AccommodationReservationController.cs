using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;  // For IEnumerable
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccommodationReservationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AccommodationReservationController> _logger;

        public AccommodationReservationController(AppDbContext context, ILogger<AccommodationReservationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST api/AccommodationReservation/accommodation
        [HttpPost("accommodation")]
        public async Task<IActionResult> BookAccommodation([FromBody] AccommodationReservationDto bookingDto)
        {
            if (bookingDto == null)
                return BadRequest("Invalid booking data.");

            if (bookingDto.EndDate <= bookingDto.StartDate)
                return BadRequest("Check-out date must be after check-in date.");

            var accommodation = await _context.Accommodations
                .FirstOrDefaultAsync(a => a.Id == bookingDto.AccommodationId);

            if (accommodation == null)
                return NotFound("Accommodation not found.");

            if (bookingDto.Guests < 1 || bookingDto.Guests > accommodation.MaxGuests)
                return BadRequest($"Guests must be between 1 and {accommodation.MaxGuests}.");

            var nights = (bookingDto.EndDate - bookingDto.StartDate).Days;

            // Calculate total amount considering number of guests
            var totalAmount = accommodation.PricePerNight * nights * bookingDto.Guests;

            var reservation = new AccommodationReservation
            {
                AccommodationId = bookingDto.AccommodationId,
                StartDate = bookingDto.StartDate,
                EndDate = bookingDto.EndDate,
                Guests = bookingDto.Guests,
                CustomerName = bookingDto.CustomerName,
                AdditionalRequirements = bookingDto.SpecialRequests,
                TotalAmount = totalAmount,  // <-- here it must be assigned
                Status = "Pending",
                BookingDate = DateTime.UtcNow,
                TripId = bookingDto.TripId
            };

            try
            {
                _context.AccommodationReservations.Add(reservation);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error booking accommodation: {ex.Message}");
            }
        }


        // GET api/AccommodationReservation/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AccommodationReservation>> GetReservation(int id)
        {
            var reservation = await _context.AccommodationReservations
                                            .Include(r => r.Accommodation)
                                            .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
                return NotFound();

            return reservation;
        }

        // GET api/AccommodationReservation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccommodationReservation>>> GetAllReservations()
        {
            var reservations = await _context.AccommodationReservations
                                             .Include(r => r.Accommodation)
                                             .ToListAsync();

            return Ok(reservations);
        }

        // GET api/AccommodationReservation/accommodation/{accommodationId}
        [HttpGet("accommodation/{accommodationId}")]
        public async Task<ActionResult<IEnumerable<AccommodationReservation>>> GetReservationsByAccommodation(int accommodationId)
        {
            var reservations = await _context.AccommodationReservations
                                             .Include(r => r.Accommodation)
                                             .Where(r => r.AccommodationId == accommodationId)
                                             .ToListAsync();

            return Ok(reservations);
        }
        // GET: api/AccommodationReservations/my-reservations
        [HttpGet("useraccommodations")]
        [Authorize] // Ensure user is authenticated
        public async Task<ActionResult<IEnumerable<object>>> GetMyAccommodationReservations()
        {
            try
            {
                // Get the current user's ID from the JWT token
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user ID");
                }

                // Fetch all reservations for the current user with related data
                var reservations = await _context.AccommodationReservations
                    .Where(r => r.CustomerId == userId)
                    .Include(r => r.Accommodation) // Include accommodation details
                    .Include(r => r.Customer) // Include customer details if needed
                    .OrderByDescending(r => r.BookingDate) // Most recent first
                    .Select(r => new
                    {
                        id = r.Id,
                        accommodationId = r.AccommodationId,
                        accommodation = r.Accommodation != null ? new
                        {
                            id = r.Accommodation.Id,
                            name = r.Accommodation.Name,
                            location = r.Accommodation.Location,
                            // Add other accommodation properties you need
                        } : null,
                        customerName = r.CustomerName,
                        customerId = r.CustomerId,
                        startDate = r.StartDate,
                        endDate = r.EndDate,
                        guests = r.Guests,
                        additionalRequirements = r.AdditionalRequirements,
                        totalAmount = r.TotalAmount,
                        status = r.Status,
                        bookingDate = r.BookingDate,
                        tripId = r.TripId,
                        email = r.Email,
                        phone = r.Phone,
                        orderId = r.OrderId
                    })
                    .ToListAsync();

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching accommodation reservations for user");
                return StatusCode(500, "Internal server error occurred while fetching reservations");
            }
        }
    }
}
