using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlacesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlacesController(AppDbContext context)
        {
            _context = context;
        }



        // GET: api/places
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlacesToVisit>>> GetAllPlaces()
        {
            var places = await _context.PlacesToVisit.ToListAsync();
            return Ok(places);
        }



        // GET: api/places/2 - For getting details of a single place
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PlacesToVisit>> GetPlaceDetails(int id)

        {
            // Find the place by its ID
            var place = await _context.PlacesToVisit
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            // If place not found, return a 404 Not Found
            if (place == null)
                return NotFound("Place not found");

            return Ok(place);
        }




        [HttpGet("by-category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<PlacesToVisit>>> GetPlacesByCategory(int categoryId)
        {
            // Fetch places that belong to the given categoryId
            var places = await _context.PlacesToVisit
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();

            // If no places found, return a 404 Not Found
            if (places == null || places.Count == 0)
                return NotFound("No places found for this category");

            return Ok(places);
        }







        // DELETE: api/places/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePlace(int id)
        {
            var place = await _context.PlacesToVisit.FindAsync(id);

            if (place == null)
            {
                return NotFound("Place not found");
            }

            _context.PlacesToVisit.Remove(place);
            await _context.SaveChangesAsync();

            return Ok("Place deleted successfully");
        }

        // GET: api/places/count
        [HttpGet("count")]
        public async Task<IActionResult> GetPlaceCount()
        {
            var count = await _context.PlacesToVisit.CountAsync();
            return Ok(count);
        }

        // GET: api/places/popular


        // GET: api/11/images
        [HttpGet("{placeId}/images")]
        public async Task<IActionResult> GetPlaceImages(int placeId)
        {
            var images = await _context.PlaceImages
                .Where(pi => pi.PlaceId == placeId)
                .Select(pi => pi.ImageUrl)
                .ToListAsync();

            return Ok(images);
        }


    }
}