using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;  // For IEnumerable
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccommodationReservationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccommodationReservationController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/AccommodationReservation/accommodation
        [HttpPost("accommodation")]
        public async Task<IActionResult> BookAccommodation([FromBody] AccommodationReservationDto bookingDto)
        {
            if (bookingDto == null)
                return BadRequest("Invalid booking data.");

            if (bookingDto.CheckOutDate <= bookingDto.CheckInDate)
                return BadRequest("Check-out date must be after check-in date.");

            var accommodation = await _context.Accommodations
                .FirstOrDefaultAsync(a => a.Id == bookingDto.AccommodationId);

            if (accommodation == null)
                return NotFound("Accommodation not found.");

            if (bookingDto.Guests < 1 || bookingDto.Guests > accommodation.MaxGuests)
                return BadRequest($"Guests must be between 1 and {accommodation.MaxGuests}.");

            var nights = (bookingDto.CheckOutDate - bookingDto.CheckInDate).Days;
            var totalAmount = accommodation.PricePerNight * nights;

            var reservation = new AccommodationReservation
            {
                AccommodationId = bookingDto.AccommodationId,
                StartDate = bookingDto.CheckInDate,
                EndDate = bookingDto.CheckOutDate,
                Guests = bookingDto.Guests,
                CustomerName = bookingDto.CustomerName,
                AdditionalRequirements = bookingDto.SpecialRequests,
                TotalAmount = totalAmount,
                Status = "Pending",
                BookingDate = DateTime.UtcNow,
                TripId = string.IsNullOrEmpty(bookingDto.TripId) ? (int?)null : int.Parse(bookingDto.TripId),
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
    }
}
