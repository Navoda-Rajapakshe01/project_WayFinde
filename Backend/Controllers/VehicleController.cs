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
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Cloudinary _cloudinary;

        public VehicleController(AppDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromForm] VehicleCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // 🚨 Return validation errors!
            }

            if (dto == null)
                return BadRequest();

            // Validate DistrictId exists
            var districtExists = await _context.Districts.AnyAsync(d => d.Id == dto.DistrictId);
            if (!districtExists)
                return BadRequest($"District with Id {dto.DistrictId} does not exist.");

            // Validate Supplier
            var supplier = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == dto.SupplierId);
            if (supplier == null)
                return BadRequest($"Supplier account not found.");

            // Create Vehicle
            var vehicle = new Vehicle
            {
                Brand = dto.Brand,
                Model = dto.Model,
                PricePerDay = dto.PricePerDay,
                Location = dto.Location,
                Type = dto.Type,
                NumberOfPassengers = dto.NumberOfPassengers,
                FuelType = dto.FuelType,
                TransmissionType = dto.TransmissionType,
                DistrictId = dto.DistrictId,
                PlaceId = dto.PlaceId,
                IsAvailable = true,
                SupplierId = supplier.Id,
                SupplierUsername = supplier.Username
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            // Save Amenities
            if (dto.Amenities != null)
            {
                foreach (var amenity in dto.Amenities)
                {
                    _context.VehicleAmenities.Add(new VehicleAmenity
                    {
                        VehicleId = vehicle.Id,
                        AmenityName = amenity
                    });
                }
            }

            // Upload Images
            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    var imageUrl = await UploadFileToCloudinary(file);
                    _context.VehicleImages.Add(new VehicleImage
                    {
                        VehicleId = vehicle.Id,
                        ImageUrl = imageUrl
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(vehicle);
        }

        private async Task<string> UploadFileToCloudinary(IFormFile file)
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "vehicles"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                return uploadResult.SecureUrl.ToString();

            throw new Exception("Failed to upload image to Cloudinary.");
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] VehicleUpdateStatusDto dto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            vehicle.IsAvailable = dto.Status == "Available";
            await _context.SaveChangesAsync();

            return Ok(vehicle);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Images)
                .Include(v => v.Amenities)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound();

            if (vehicle.Images != null)
                _context.VehicleImages.RemoveRange(vehicle.Images);

            if (vehicle.Amenities != null)
                _context.VehicleAmenities.RemoveRange(vehicle.Amenities);

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("/api/bookings/vehicle/{vehicleId}")]
        public async Task<IActionResult> GetBookingsByVehicle(int vehicleId)
        {
            var bookings = await _context.VehicleReservations
                .Where(b => b.VehicleId == vehicleId)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleDto>>> GetVehicles()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.Images)
                .Include(v => v.Amenities)
                .ToListAsync();

            var dtos = vehicles.Select(MapToDto);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDto>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Images)
                .Include(v => v.Amenities)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound();

            return Ok(MapToDto(vehicle));
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetVehicleCount()
        {
            var count = await _context.Vehicles.CountAsync();
            return Ok(count);
        }

        private VehicleDto MapToDto(Vehicle vehicle)
        {
            return new VehicleDto
            {
                Id = vehicle.Id,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                Type = vehicle.Type ?? string.Empty,
                NumberOfPassengers = vehicle.NumberOfPassengers,
                FuelType = vehicle.FuelType ?? string.Empty,
                TransmissionType = vehicle.TransmissionType ?? string.Empty,
                Location = vehicle.Location ?? string.Empty,
                PricePerDay = vehicle.PricePerDay,
                IsAvailable = vehicle.IsAvailable,
                DistrictId = vehicle.DistrictId,
                PlaceId = vehicle.PlaceId,
                SupplierId = vehicle.SupplierId,
                SupplierUsername = vehicle.SupplierUsername ?? string.Empty,
                ImageUrls = vehicle.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                Amenities = vehicle.Amenities?.Select(a => a.AmenityName).ToList() ?? new List<string>(),
            };
        }
    }
}
