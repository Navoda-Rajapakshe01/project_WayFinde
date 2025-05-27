using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccommodationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccommodationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccommodation([FromForm] AccommodationCreateDto dto)
        {
            if (dto == null) return BadRequest();

            var accommodation = new Accommodation
            {
                Name = dto.Name,
                Type = dto.Type,
                Location = dto.Location,
                PricePerNight = dto.PricePerNight,
                Bedrooms = dto.Bedrooms,
                Bathrooms = dto.Bathrooms,
                MaxGuests = dto.MaxGuests,
                Description = dto.Description,
                IsAvailable = true
            };

            _context.Accommodations.Add(accommodation);
            await _context.SaveChangesAsync();

            // Add amenities
            if (dto.Amenities != null)
            {
                foreach (var amenity in dto.Amenities)
                {
                    _context.AccommodationAmenities.Add(new AccommodationAmenity
                    {
                        AccommodationId = accommodation.Id,
                        AmenityName = amenity
                    });
                }
            }

            // Add images
            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    var imageUrl = await SaveFileAndGetUrlAsync(file);
                    _context.AccommodationImages.Add(new AccommodationImage
                    {
                        AccommodationId = accommodation.Id,
                        ImageUrl = imageUrl
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(accommodation);
        }

        private async Task<string> SaveFileAndGetUrlAsync(Microsoft.AspNetCore.Http.IFormFile file)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/{fileName}";
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] AccommodationUpdateStatusDto dto)
        {
            var accommodation = await _context.Accommodations.FindAsync(id);
            if (accommodation == null) return NotFound();

            accommodation.IsAvailable = dto.Status == "Available";
            await _context.SaveChangesAsync();

            return Ok(accommodation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccommodation(int id)
        {
            var accommodation = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (accommodation == null) return NotFound();

            if (accommodation.Images != null)
                _context.AccommodationImages.RemoveRange(accommodation.Images);

            if (accommodation.Amenities != null)
                _context.AccommodationAmenities.RemoveRange(accommodation.Amenities);

            _context.Accommodations.Remove(accommodation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAccommodations()
        {
            var accommodations = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .ToListAsync();

            var dtos = accommodations.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccommodation(int id)
        {
            var accommodation = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (accommodation == null) return NotFound();

            return Ok(MapToDto(accommodation));
        }

        private AccommodationDto MapToDto(Accommodation accommodation)
        {
            return new AccommodationDto
            {
                Id = accommodation.Id,
                Name = accommodation.Name,
                Type = accommodation.Type ?? string.Empty,
                Location = accommodation.Location ?? string.Empty,
                PricePerNight = accommodation.PricePerNight,
                Bedrooms = accommodation.Bedrooms,
                Bathrooms = accommodation.Bathrooms,
                MaxGuests = accommodation.MaxGuests,
                Description = accommodation.Description ?? string.Empty,
                IsAvailable = accommodation.IsAvailable,
                // Removed SupplierId mapping
                ImageUrls = accommodation.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                Amenities = accommodation.Amenities?.Select(a => a.AmenityName).ToList() ?? new List<string>()
            };
        }
    }
}
