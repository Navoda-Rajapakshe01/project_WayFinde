using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccommodationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public AccommodationController(AppDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccommodation([FromForm] AccommodationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _context.Districts.AnyAsync(d => d.Id == dto.DistrictId))
                return BadRequest($"District with Id {dto.DistrictId} does not exist.");

            if (!await _context.PlacesToVisit.AnyAsync(p => p.Id == dto.PlaceId))
                return BadRequest($"Place with Id {dto.PlaceId} does not exist.");

            var supplier = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == dto.SupplierId);
            if (supplier == null)
                return BadRequest("Supplier not found.");

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
                DistrictId = dto.DistrictId,
                PlaceId = dto.PlaceId,
                SupplierId = supplier.Id,
                SupplierUsername = supplier.Username,
                IsAvailable = true
            };

            _context.Accommodations.Add(accommodation);
            await _context.SaveChangesAsync();

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

            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    var imageUrl = await UploadFileToCloudinary(file);
                    _context.AccommodationImages.Add(new AccommodationImage
                    {
                        AccommodationId = accommodation.Id,
                        ImageUrl = imageUrl
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(MapToDto(accommodation));
        }

        private async Task<string> UploadFileToCloudinary(IFormFile file)
        {
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "accommodations"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                return uploadResult.SecureUrl.ToString();

            throw new Exception("Failed to upload image to Cloudinary.");
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] AccommodationUpdateStatusDto dto)
        {
            var accommodation = await _context.Accommodations.FindAsync(id);
            if (accommodation == null)
                return NotFound();

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

            if (accommodation == null)
                return NotFound();

            if (accommodation.Images != null)
                _context.AccommodationImages.RemoveRange(accommodation.Images);

            if (accommodation.Amenities != null)
                _context.AccommodationAmenities.RemoveRange(accommodation.Amenities);

            _context.Accommodations.Remove(accommodation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccommodationDto>>> GetAccommodations()
        {
            var accommodations = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .Include(a => a.Supplier)
                .Include(a => a.District)
                .Include(a => a.PlacesToVisit)
                .ToListAsync();

            var dtos = accommodations.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccommodationDto>> GetAccommodation(int id)
        {
            var accommodation = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .Include(a => a.Supplier)
                .Include(a => a.District)
                .Include(a => a.PlacesToVisit)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (accommodation == null)
                return NotFound();

            return Ok(MapToDto(accommodation));
        }

        private AccommodationDto MapToDto(Accommodation a)
        {
            return new AccommodationDto
            {
                Id = a.Id,
                Name = a.Name,
                Type = a.Type ?? string.Empty,
                Location = a.Location ?? string.Empty,
                PricePerNight = a.PricePerNight,
                Bedrooms = a.Bedrooms,
                Bathrooms = a.Bathrooms,
                MaxGuests = a.MaxGuests,
                Description = a.Description ?? string.Empty,
                DistrictId = a.DistrictId,
                PlaceId = a.PlaceId,
                SupplierId = a.SupplierId,
                SupplierUsername = a.SupplierUsername ?? string.Empty,
                IsAvailable = a.IsAvailable,
                ImageUrls = a.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                Amenities = a.Amenities?.Select(aa => aa.AmenityName).ToList() ?? new List<string>()
            };
        }
    }
}
