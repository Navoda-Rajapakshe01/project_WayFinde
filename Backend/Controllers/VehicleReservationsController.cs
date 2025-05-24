using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleReservationsController : ControllerBase
    {
        private readonly VehicleReservationService _reservationService;
        private readonly AppDbContext _context;

        // Fix: Provide a name for the AppDbContext parameter in the constructor
        public VehicleReservationsController(VehicleReservationService reservationService, AppDbContext context)
        {
            _reservationService = reservationService;
            _context = context;  // Initialize _context with the injected AppDbContext
        }

        [HttpPost("reserve")]
        public async Task<IActionResult> CreateReservation([FromBody] VehicleReservationDTO reservationDto)
        {
            if (reservationDto == null)
            {
                return BadRequest("Invalid reservation data.");
            }

            try
            {
                // Using the reservation service to create the reservation
                var reservation = await _reservationService.CreateReservationAsync(reservationDto);
                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating reservation: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleReservation>> GetReservation(int id)
        {
            var reservation = await _context.VehicleReservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }
    }
}
