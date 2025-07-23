using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;  // For IEnumerable
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleReservationsController : ControllerBase
    {
        private readonly VehicleReservationService _reservationService;
        private readonly AppDbContext _context;

        public VehicleReservationsController(VehicleReservationService reservationService, AppDbContext context)
        {
            _reservationService = reservationService;
            _context = context;
        }

        // POST api/VehicleReservations/reserve
        [HttpPost("reserve")]
        public async Task<IActionResult> CreateReservation([FromBody] VehicleReservationDTO reservationDto)
        {
            if (reservationDto == null)
            {
                return BadRequest("Invalid reservation data.");
            }

            try
            {
                var reservation = await _reservationService.CreateReservationAsync(reservationDto);
                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating reservation: {ex.Message}");
            }
        }

        // GET api/VehicleReservations/{id}
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

        // GET api/VehicleReservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleReservation>>> GetAllReservations()
        {
            var reservations = await _context.VehicleReservations
                                             .Include(r => r.Vehicle)
                                             .ToListAsync();

            return Ok(reservations);
        }

        // GET api/VehicleReservations/vehicle/{vehicleId}
        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<VehicleReservation>>> GetReservationsByVehicle(int vehicleId)
        {
            var reservations = await _context.VehicleReservations
                                             .Include(r => r.Vehicle)
                                             .Where(r => r.VehicleId == vehicleId)
                                             .ToListAsync();

            return Ok(reservations);
        }

        [HttpGet("supplier/{supplierId}")]
        public async Task<IActionResult> GetReservationsBySupplier(Guid supplierId)
        {
            try
            {
                // Get all reservations for vehicles owned by the supplier
                var reservations = await _context.VehicleReservations
                    .Include(r => r.Vehicle)
                    .Where(r => r.Vehicle != null && r.Vehicle.SupplierId == supplierId)
                    .ToListAsync();

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
