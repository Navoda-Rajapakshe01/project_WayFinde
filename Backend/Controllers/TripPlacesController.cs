using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripPlacesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripPlacesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TripPlaces
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TripPlace>>> GetTripPlaces()
        {
            return await _context.TripPlaces.ToListAsync();
        }

        // GET: api/TripPlaces/5
        [HttpGet("{tripId}/{placeId}")]
        public async Task<ActionResult<TripPlace>> GetTripPlace(int tripId, int placeId)
        {
            var tripPlace = await _context.TripPlaces.FindAsync(tripId, placeId);

            if (tripPlace == null)
            {
                return NotFound();
            }

            return tripPlace;
        }

        // POST: api/TripPlaces
        [HttpPost]
        public async Task<ActionResult<TripPlace>> PostTripPlace(TripPlaceDto tripPlaceDto)
        {
            var tripPlace = new TripPlace
            {
                TripId = tripPlaceDto.TripId,
                PlaceId = tripPlaceDto.PlaceId
            };

            _context.TripPlaces.Add(tripPlace);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTripPlace), new { tripId = tripPlace.TripId, placeId = tripPlace.PlaceId }, tripPlace);
        }

        // PUT: api/TripPlaces/5
        [HttpPut("{tripId}/{placeId}")]
        public async Task<IActionResult> PutTripPlace(int tripId, int placeId, TripPlaceDto tripPlaceDto)
        {
            if (tripId != tripPlaceDto.TripId || placeId != tripPlaceDto.PlaceId)
            {
                return BadRequest();
            }

            var tripPlace = await _context.TripPlaces.FindAsync(tripId, placeId);
            if (tripPlace == null)
            {
                return NotFound();
            }

            tripPlace.TripId = tripPlaceDto.TripId;
            tripPlace.PlaceId = tripPlaceDto.PlaceId;

            _context.Entry(tripPlace).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripPlaceExists(tripId, placeId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TripPlaces/5
        [HttpDelete("{tripId}/{placeId}")]
        public async Task<IActionResult> DeleteTripPlace(int tripId, int placeId)
        {
            var tripPlace = await _context.TripPlaces.FindAsync(tripId, placeId);
            if (tripPlace == null)
            {
                return NotFound();
            }

            _context.TripPlaces.Remove(tripPlace);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TripPlaceExists(int tripId, int placeId)
        {
            return _context.TripPlaces.Any(e => e.TripId == tripId && e.PlaceId == placeId);
        }
    }
} 