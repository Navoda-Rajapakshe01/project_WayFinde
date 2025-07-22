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

        // GET: api/places/by-district-name/nuwara-eliya
        [HttpGet("by-district-name/{slug}")]
        public async Task<IActionResult> GetPlacesByDistrictSlug(string slug)
        {
            var district = await _context.Districts
                .FirstOrDefaultAsync(d => d.Slug.ToLower() == slug.ToLower());

            if (district == null)
                return NotFound("District not found");

            var places = await _context.PlacesToVisit
                .Where(p => p.DistrictId == district.Id)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    categoryId = p.CategoryId,
                    mainImageUrl = p.MainImageUrl,
                    description = p.Description,
                    // Add any other properties you need for the frontend
                })
                .ToListAsync();

            return Ok(places);
        }

        // GET: api/places/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Select(c => new
                {
                    categoryId = c.CategoryId,
                    categoryName = c.CategoryName
                })
                .ToListAsync();

            return Ok(categories);
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

       
        
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var places = await _context.PlacesToVisit
                .Include(p => p.District)
                .Include(p => p.Category)
                .Include(p => p.Reviews)            // load reviews for average
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.GoogleMapLink,
                    AvgTime = p.AvgTime,
                    AvgSpend = p.AvgSpend,
                    p.CategoryId,
                    CategoryName = p.Category.CategoryName,
                    MainImageUrl = p.MainImageUrl,

                    // dynamic average rating
                    Rating = p.Reviews.Any()
                        ? p.Reviews.Average(r => r.Rating)
                        : (double?)null,

                    District = new
                    {
                        p.District.Id,
                        p.District.Name,
                        p.District.SubTitle,
                        p.District.ImageUrl
                    }
                })
                .ToListAsync();

            return Ok(places);
        }




        [HttpPost]
        public async Task<IActionResult> AddPlace([FromBody] AddPlaceDTO dto)
        {
            // Check if a place with the same name already exists
            var existingPlace = await _context.PlacesToVisit
            .FirstOrDefaultAsync(p =>
                p.Name.ToLower() == dto.Name.ToLower().Trim() &&
                p.DistrictId == dto.DistrictId);

            if (existingPlace != null)
            {
                return Conflict("A place with the same name already exists in this district.");
            }

            // Check related entities exist
            var district = await _context.Districts.FindAsync(dto.DistrictId);
            if (district == null) return BadRequest("District not found.");

            var category = dto.CategoryId.HasValue
                ? await _context.Categories.FindAsync(dto.CategoryId.Value)
                : null;

            if (dto.CategoryId.HasValue && category == null)
                return BadRequest("Category not found.");

            // Create the new place
            var place = new PlacesToVisit
            {
                Name = dto.Name,
                MainImageUrl = dto.MainImageUrl,
                Description = dto.Description,
                History = dto.History,
                OpeningHours = dto.OpeningHours,
                Address = dto.Address,
                GoogleMapLink = dto.GoogleMapLink,
                DistrictId = dto.DistrictId ?? throw new ArgumentNullException(nameof(dto.DistrictId), "DistrictId cannot be null"),
                District = district,
                CategoryId = dto.CategoryId ?? 0,
                Category = category!,
                PlaceImage = new List<PlaceImage>(),
                TripPlaces = new List<TripPlace>(),
            };

            _context.PlacesToVisit.Add(place);
            await _context.SaveChangesAsync();

            return Ok(place);
        }

        // PATCH: api/places/5
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdatePlace(int id, [FromBody] UpdatePlaceDTO dto)
        {
            // Check if the DTO is valid
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the place by its ID
            var place = await _context.PlacesToVisit
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (place == null)
            {
                return NotFound("Place not found");
            }

            // Check if a place with the same name exists in the district
            var existingPlace = await _context.PlacesToVisit
                .FirstOrDefaultAsync(p =>
                    p.Name.ToLower() == dto.Name.ToLower().Trim() &&
                    p.DistrictId == dto.DistrictId &&
                    p.Id != id); // Ensure it’s not the same place being updated

            if (existingPlace != null)
            {
                return Conflict("A place with the same name already exists in this district.");
            }

            // Check if related entities exist
            var district = await _context.Districts.FindAsync(dto.DistrictId);
            if (district == null) return BadRequest("District not found.");

            var category = dto.CategoryId.HasValue
                ? await _context.Categories.FindAsync(dto.CategoryId.Value)
                : null;

            if (dto.CategoryId.HasValue && category == null)
                return BadRequest("Category not found.");

            // Update the place details
            place.Name = dto.Name;
            place.Description = dto.Description;
            place.History = dto.History;
            place.OpeningHours = dto.OpeningHours;
            place.Address = dto.Address;
            place.GoogleMapLink = dto.GoogleMapLink;
            place.MainImageUrl = dto.MainImageUrl;
            place.DistrictId = dto.DistrictId;
            place.District = district;
            place.CategoryId = dto.CategoryId ?? place.CategoryId;
            place.Category = category ?? place.Category;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating the place.");
            }

            return Ok(place);
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
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularPlaces()
        {
            // Get top 8 places by average rating, then by number of reviews
            var popularPlaces = await _context.PlacesToVisit
                .Include(p => p.District)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.MainImageUrl,
                    p.Address,
                    District = new
                    {
                        p.District.Id,
                        p.District.Name
                    },
                    Category = new
                    {
                        p.Category.CategoryId,
                        p.Category.CategoryName
                    },
                    AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
                    ReviewCount = p.Reviews.Count
                })
                .OrderByDescending(p => p.AverageRating)
                .ThenByDescending(p => p.ReviewCount)
                .Take(8)
                .AsNoTracking()
                .ToListAsync();

            return Ok(popularPlaces);
        }

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

        // GET: api/places/top-rated
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedPlaces()
        {
            var topRatedPlaces = await _context.PlacesToVisit
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.MainImageUrl,
                    p.Address,
                    AverageRating = _context.Reviews
                        .Where(r => r.PlaceId == p.Id)
                        .Select(r => (double?)r.Rating)
                        .Average() ?? 0
                })
                .OrderByDescending(p => p.AverageRating)
                .Take(4)
                .AsNoTracking()
                .ToListAsync();

            return Ok(topRatedPlaces);
  }

}
}