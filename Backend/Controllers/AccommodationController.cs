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

            if (dto == null)
                return BadRequest("Accommodation data is missing.");

            
                // Validate DistrictId exists
                var districtExists = await _context.Districts.AnyAsync(d => d.Id == dto.DistrictId);
                if (!districtExists)
                    return BadRequest($"District with Id {dto.DistrictId} does not exist.");

                // Validate Supplier
                var supplier = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == dto.SupplierId);
                if (supplier == null)
                    return BadRequest($"Supplier account not found.");

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
                    IsAvailable = true,
                    PlaceId = dto.PlaceId,
                    SupplierId = supplier.Id,
                    SupplierUsername = supplier.Username
                };

                _context.Accommodations.Add(accommodation);
                await _context.SaveChangesAsync();

                // Add amenities if any
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

                // Upload images to Cloudinary and save URLs
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

                return Ok(accommodation);
            }
             private async Task<string> UploadFileToCloudinary(IFormFile file)
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "accommodation"
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

        [HttpGet("/api/bookings/accommodation/{accommodationId}")]
        public async Task<IActionResult> GetBookingsByAccommodation(int accommodationId)
        {
            var bookings = await _context.AccommodationReservations
                .Where(b => b.AccommodationId == accommodationId)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccommodationDto>>> GetAccommodations()
        {
            var accommodations = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .Include(a => a.Supplier)      // include supplier navigation
                .Include(a => a.District)      // include district navigation
                .Include(a => a.PlacesToVisit) // include place navigation
                .ToListAsync();

            var dtos = accommodations.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccommodationDto>> GetAccommodationById(int id)

        {
            var accommodation = await _context.Accommodations
                .Include(a => a.Images)
                .Include(a => a.Amenities)
                .Include(a => a.Supplier)
                .Include(a => a.District)
                .Include(a => a.PlacesToVisit)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (accommodation == null) return NotFound();

            return Ok(MapToDto(accommodation));
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetAccommodationCount()
        {
            var count = await _context.Accommodations.CountAsync();
            return Ok(count);
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
                ImageUrls = accommodation.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                Amenities = accommodation.Amenities?.Select(a => a.AmenityName).ToList() ?? new List<string>(),
                DistrictId = accommodation.DistrictId,
                PlaceId = accommodation.PlaceId,
                SupplierId = accommodation.SupplierId,
                SupplierUsername = accommodation.SupplierUsername ?? string.Empty,
            };
        }
    }
}