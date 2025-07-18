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

        // PUT api/AccommodationReservation/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] AccommodationUpdateStatusDto dto)
        {
            var reservation = await _context.AccommodationReservations.FindAsync(id);

            if (reservation == null)
                return NotFound("Reservation not found.");

            if (string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest("Status cannot be empty.");

            reservation.Status = dto.Status;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating reservation status: {ex.Message}");
            }
        }


        // DELETE api/AccommodationReservation/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.AccommodationReservations.FindAsync(id);

            if (reservation == null)
                return NotFound("Reservation not found.");

            _context.AccommodationReservations.Remove(reservation);

            try
            {
                await _context.SaveChangesAsync();
                return Ok($"Reservation with ID {id} has been deleted.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting reservation: {ex.Message}");
            }
        }
    }
}
