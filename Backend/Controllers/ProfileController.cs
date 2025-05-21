using Backend.Models;

using Backend.DTOs;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;
        private readonly AppDbContext _context;

        public ProfileController(
             Cloudinary cloudinary,
             AppDbContext context,
             IAuthService authService,
             IUserService userService)
        {
            _cloudinary = cloudinary;
            _context = context;
            _authService = authService;
            _userService = userService;
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null || !Guid.TryParse(userId, out Guid userGuid))
                return Unauthorized();

            var result = await _userService.UpdateUserAsync(userGuid, updateProfileDto.Username, updateProfileDto.ContactEmail, updateProfileDto.ProfilePictureUrl);
            if (!result) return NotFound("User not found");

            return Ok("Profile updated successfully");
        }

        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "profile_pictures"
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                return StatusCode(500, "Cloudinary upload failed.");

            string imageUrl = uploadResult.SecureUrl.ToString();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID.");

            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            user.ProfilePictureUrl = imageUrl;
            await _context.SaveChangesAsync();

            return Ok(new { profilePictureUrl = imageUrl });
        }

        [HttpPut("update-bio")]
        [Authorize]
        public async Task<IActionResult> UpdateBio([FromBody] BioUpdateDto bioDto)
        {
            if (bioDto == null || string.IsNullOrEmpty(bioDto.Bio))
                return BadRequest("Bio content is required.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID.");

            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            user.Bio = bioDto.Bio;

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Bio updated successfully.");
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"Database error: {dbEx.InnerException?.Message}");
                return StatusCode(500, $"Database error: {dbEx.InnerException?.Message}");
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID format.");

            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.ContactEmail,
                user.Bio,
                user.ProfilePictureUrl
                
            });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID");

            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            // Use ASP.NET Core Identity password hasher
            var hasher = new PasswordHasher<UserNew>();
            var verificationResult = hasher.VerifyHashedPassword(user, user.PasswordHash, model.CurrentPassword);

            if (verificationResult == PasswordVerificationResult.Failed)
                return BadRequest("Current password is incorrect.");

            // Update to new hashed password
            user.PasswordHash = hasher.HashPassword(user, model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }

    }
}
