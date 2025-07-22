using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BackupController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("export")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExportAllData()
        {
            // Project each entity to exclude navigation properties
            var users = await _context.UsersNew
                .Select(u => new {
                    u.Id, u.Username, u.PasswordHash, u.ContactEmail, u.Role, u.ServiceType, u.ProfilePictureUrl, u.RegisteredDate, u.LastLoginDate, u.Bio, u.PhoneNumber, u.FollowersCount, u.FollowingCount
                }).ToListAsync();
            var blogs = await _context.Blogs
                .Select(b => new {
                    b.Id, b.Title, b.BlogUrl, b.CreatedAt, b.UserId, b.Location, b.Tags, b.NumberOfComments, b.NumberOfReads, b.NumberOfReacts, b.Author, b.CoverImageUrl, b.ImageUrls, b.Description
                }).ToListAsync();
            var posts = await _context.Posts
                .Select(p => new {
                    p.Id, p.Title, p.Content, p.CreatedAt, p.UserId, p.Tags, p.NumberOfComments, p.NumberOfReads, p.NumberOfReacts, p.CoverImageUrl, p.ImageUrls
                }).ToListAsync();
            var follows = await _context.Follows
                .Select(f => new { f.FollowerID, f.FollowedID, f.FollowDate }).ToListAsync();
            var vehicles = await _context.Vehicles
                .Select(v => new { v.Id, v.Brand, v.Model, v.Type, v.NumberOfPassengers, v.FuelType, v.TransmissionType, v.Location, v.PricePerDay, v.IsAvailable }).ToListAsync();
            var vehicleImages = await _context.VehicleImages.ToListAsync();
            var vehicleReviews = await _context.VehicleReviews
                .Select(vr => new { vr.Id, vr.Comment, vr.Rating, vr.VehicleId }).ToListAsync();
            var vehicleReservations = await _context.VehicleReservations.ToListAsync();
            var vehicleAmenities = await _context.VehicleAmenities
                .Select(a => new { a.Id, a.VehicleId, a.AmenityName }).ToListAsync();
            var districts = await _context.Districts
                .Select(d => new { d.Id, d.Name, d.ImageUrl, d.Slug, d.SubTitle }).ToListAsync();
            var places = await _context.PlacesToVisit
                .Select(p => new { p.Id, p.Name, p.MainImageUrl, p.Description, p.History, p.OpeningHours, p.Address, p.GoogleMapLink, p.AvgSpend, p.AvgTime, p.DistrictId, p.CategoryId }).ToListAsync();
            var categories = await _context.Categories.ToListAsync();
            var reviews = await _context.Reviews
                .Select(r => new { r.Id, r.PlaceId, r.Name, r.Email, r.Rating, r.Comment, r.CreatedAt }).ToListAsync();
            var placeImages = await _context.PlaceImages.ToListAsync();
            var tripPlaces = await _context.TripPlaces
                .Select(tp => new { tp.TripId, tp.PlaceId, tp.Order }).ToListAsync();
            var tripCollaborators = await _context.TripCollaborator
                .Select(tc => new { tc.Id, tc.TripId, tc.UserId, tc.IsAccepted, tc.AddedAt }).ToListAsync();
            var tripDates = await _context.TripDate.ToListAsync();
            var todoItems = await _context.TodoItems.ToListAsync();
            var comments = await _context.Comments
                .Select(c => new { c.Id, c.UserId, c.BlogId, c.Content, c.CreatedAt }).ToListAsync();
            var travelBudgets = await _context.TravelBudgets.ToListAsync();
            var dashboardNotes = await _context.DashboardNote.ToListAsync();
            var accommodations = await _context.Accommodations.ToListAsync();
            var accommodationImages = await _context.AccommodationImages
                .Select(ai => new { ai.Id, ai.ImageUrl, ai.AccommodationId }).ToListAsync();
            var accommodationReviews = await _context.AccommodationReviews
                .Select(ar => new { ar.Id, ar.Comment, ar.Rating, ar.AccommodationId }).ToListAsync();
            var accommodationReservations = await _context.AccommodationReservations.ToListAsync();
            var accommodationAmenities = await _context.AccommodationAmenities
                .Select(a => new { a.Id, a.AccommodationId, a.AmenityName }).ToListAsync();
            var blogReactions = await _context.BlogReactions
                .Select(br => new { br.Id, br.BlogId, br.UserId, br.CreatedAt }).ToListAsync();
            var trips = await _context.Trips
                .Select(t => new { t.Id, t.TripName, t.StartDate, t.EndDate, t.UserId, t.CreatedAt, t.UpdatedAt }).ToListAsync();

            var backup = new
            {
                users,
                blogs,
                posts,
                follows,
                vehicles,
                vehicleImages,
                vehicleReviews,
                vehicleReservations,
                vehicleAmenities,
                districts,
                places,
                categories,
                reviews,
                placeImages,
                tripPlaces,
                tripCollaborators,
                tripDates,
                todoItems,
                comments,
                travelBudgets,
                dashboardNotes,
                accommodations,
                accommodationImages,
                accommodationReviews,
                accommodationReservations,
                accommodationAmenities,
                blogReactions,
                trips
            };

            var json = System.Text.Json.JsonSerializer.Serialize(backup, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            var fileName = $"wayfinde-backup-{DateTime.UtcNow:yyyyMMdd-HHmmss}.json";
            return File(bytes, "application/json", fileName);
        }
    }
} 