using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistrictController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DistrictController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/district
        [HttpGet]
        public async Task<IActionResult> GetDistrictsWithPlacesCount()
        {
            var result = await _context.Districts
                .Select(d => new DistrictWithPlacesCountDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    ImageUrl = d.ImageUrl,
                    Slug = d.Slug,
                    SubTitle = d.SubTitle,
                    PlacesCount = _context.PlacesToVisit.Count(p => p.DistrictId == d.Id)
                })
                .ToListAsync();

            return Ok(result);
        }

        // GET: api/district/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDistrict(int id)
        {
            var district = await _context.Districts
                .Include(d => d.PlacesToVisit)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (district == null)
                return NotFound(new { message = "District not found" });

            var result = new DistrictWithPlacesCountDTO
            {
                Id = district.Id,
                Name = district.Name,
                ImageUrl = district.ImageUrl,
                Slug = district.Slug,
                SubTitle = district.SubTitle,
                PlacesCount = district.PlacesToVisit?.Count ?? 0
            };

            return Ok(result);
        }

        // GET: api/district/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetDistrictBySlug(string slug)
        {
            var district = await _context.Districts
                .Include(d => d.PlacesToVisit)
                .FirstOrDefaultAsync(d => d.Slug == slug);

            if (district == null)
                return NotFound(new { message = "District not found" });

            var result = new DistrictWithPlacesCountDTO
            {
                Id = district.Id,
                Name = district.Name,
                ImageUrl = district.ImageUrl,
                Slug = district.Slug,
                SubTitle = district.SubTitle,
                PlacesCount = district.PlacesToVisit?.Count ?? 0
            };

            return Ok(result);
        }

        // POST: api/district
        [HttpPost]
        public async Task<IActionResult> CreateDistrict([FromBody] DistrictCreateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "District data is required" });

            if (string.IsNullOrEmpty(dto.Name))
                return BadRequest(new { message = "Name is required" });

            if (string.IsNullOrEmpty(dto.ImageUrl))
                return BadRequest(new { message = "ImageUrl is required" });

            if (string.IsNullOrEmpty(dto.Slug))
                return BadRequest(new { message = "Slug is required" });

            // Check if district with same name or slug already exists
            var existingDistrict = await _context.Districts
                .FirstOrDefaultAsync(d => d.Name == dto.Name || d.Slug == dto.Slug);

            if (existingDistrict != null)
                return BadRequest(new { message = "District with this name or slug already exists" });

            var district = new District
            {
                Name = dto.Name,
                ImageUrl = dto.ImageUrl,
                Slug = dto.Slug,
                SubTitle = dto.SubTitle
            };

            _context.Districts.Add(district);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDistrict), new { id = district.Id }, district);
        }

        // PUT: api/district/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDistrict(int id, [FromBody] DistrictUpdateDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "District data is required" });

            var district = await _context.Districts.FindAsync(id);
            if (district == null)
                return NotFound(new { message = "District not found" });

            // Check if another district has the same name or slug
            if (!string.IsNullOrEmpty(dto.Name) && dto.Name != district.Name)
            {
                var existingDistrict = await _context.Districts
                    .FirstOrDefaultAsync(d => d.Name == dto.Name && d.Id != id);
                if (existingDistrict != null)
                    return BadRequest(new { message = "District with this name already exists" });
            }

            if (!string.IsNullOrEmpty(dto.Slug) && dto.Slug != district.Slug)
            {
                var existingDistrict = await _context.Districts
                    .FirstOrDefaultAsync(d => d.Slug == dto.Slug && d.Id != id);
                if (existingDistrict != null)
                    return BadRequest(new { message = "District with this slug already exists" });
            }

            // Update properties
            if (!string.IsNullOrEmpty(dto.Name))
                district.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.ImageUrl))
                district.ImageUrl = dto.ImageUrl;
            if (!string.IsNullOrEmpty(dto.Slug))
                district.Slug = dto.Slug;
            if (dto.SubTitle != null)
                district.SubTitle = dto.SubTitle;

            await _context.SaveChangesAsync();

            return Ok(new { message = "District updated successfully", district });
        }

        // DELETE: api/district/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDistrict(int id)
        {
            var district = await _context.Districts
                .Include(d => d.PlacesToVisit)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (district == null)
                return NotFound(new { message = "District not found" });

            // Check if district has places
            if (district.PlacesToVisit?.Any() == true)
                return BadRequest(new { message = "Cannot delete district that has places. Remove all places first." });

            _context.Districts.Remove(district);
            await _context.SaveChangesAsync();

            return Ok(new { message = "District deleted successfully" });
        }

        // GET: api/district/search?query={query}
        [HttpGet("search")]
        public async Task<IActionResult> SearchDistricts([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
                return BadRequest(new { message = "Search query is required" });

            var districts = await _context.Districts
                .Where(d => d.Name.Contains(query) || d.SubTitle.Contains(query))
                .Select(d => new DistrictWithPlacesCountDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    ImageUrl = d.ImageUrl,
                    Slug = d.Slug,
                    SubTitle = d.SubTitle,
                    PlacesCount = _context.PlacesToVisit.Count(p => p.DistrictId == d.Id)
                })
                .ToListAsync();

            return Ok(districts);
        }
    }

    // DTOs for District operations
    public class DistrictCreateDto
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Slug { get; set; }
        public string? SubTitle { get; set; }
    }

    public class DistrictUpdateDto
    {
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public string? Slug { get; set; }
        public string? SubTitle { get; set; }
    }
}