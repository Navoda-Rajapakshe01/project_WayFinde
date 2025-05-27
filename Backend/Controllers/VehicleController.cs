using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;


namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromForm] VehicleCreateDto dto)
        {
            // dto includes Brand, Model, PricePerDay, Location, Type, NumberOfPassengers, FuelType, TransmissionType
            // Amenities as List<string>, Images as IFormFileCollection

            if (dto == null) return BadRequest();

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
                IsAvailable = true
            };

            // Save vehicle first to get Id
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            // Handle amenities
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

            // Handle image uploads
            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    // Save file to disk or cloud, get URL
                    var imageUrl = await SaveFileAndGetUrlAsync(file);

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

        private async Task<string> SaveFileAndGetUrlAsync(IFormFile file)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            // Create the directory if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Return the relative URL accessible by frontend
            return $"/uploads/{fileName}";
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] VehicleUpdateStatusDto dto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

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

            if (vehicle == null) return NotFound();

            // Remove related images and amenities first
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
                ImageUrls = vehicle.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                Amenities = vehicle.Amenities?.Select(a => a.AmenityName).ToList() ?? new List<string>()
            };
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
    }
}
