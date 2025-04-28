using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
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

        // GET: api/places/by-district-name/nuwara-eliya
        [HttpGet("by-district-name/{slug}")]
        public async Task<ActionResult<IEnumerable<PlacesToVisit>>> GetPlacesByDistrictSlug(string slug)
        {
            // Find the district by the slug
            var district = await _context.Districts
                .FirstOrDefaultAsync(d => d.Slug.ToLower() == slug.ToLower());

            // If district not found, return a 404 Not Found
            if (district == null)
                return NotFound("District not found");

            // Get places belonging to the found district
            var places = await _context.PlacesToVisit
                .Where(p => p.DistrictId == district.Id)
                .ToListAsync();

            return Ok(places);
        }

        // GET: api/places/2 - For getting details of a single place
        [HttpGet("{id}")]
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
    }
}
