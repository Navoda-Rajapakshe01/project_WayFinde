using Backend.Models;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Backend.Data;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;
        private readonly UserDbContext _context;

        public ProfileController(
             Cloudinary cloudinary,
             UserDbContext context,
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

            // Upload to Cloudinary (or your storage)
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "profile_pictures"
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
                return StatusCode(500, "Cloudinary upload failed.");

            string imageUrl = uploadResult.SecureUrl.ToString();

            // ✅ Extract user ID from token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

         
            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID.");

            // Save image URL to user's profile
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
            try
            {
                // Validate input
                if (bioDto == null || string.IsNullOrEmpty(bioDto.Bio))
                {
                    return BadRequest("Bio content is required.");
                }

                // Get authenticated user
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return Unauthorized("User not authenticated.");

                if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                    return BadRequest("Invalid user ID.");

                // Find user in database
                var user = await _context.UsersNew.FindAsync(userId);
                if (user == null)
                    return NotFound("User not found.");

                // Update bio
                user.Bio = bioDto.Bio;

                // Save changes with detailed error handling
                try
                {
                    await _context.SaveChangesAsync();
                    return Ok("Bio updated successfully.");
                }
                catch (DbUpdateException dbEx)
                {
                    // Log the specific database error
                    Console.WriteLine($"Database error: {dbEx.InnerException?.Message}");
                    return StatusCode(500, $"Database error: {dbEx.InnerException?.Message}");
                }
            }
            catch (Exception ex)
            {
                // Log any other errors
                Console.WriteLine($"Error updating bio: {ex.Message}");
                return StatusCode(500, "An error occurred while updating the bio.");
            }
        }
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User not authenticated.");

            // ✅ Convert the claim value to a Guid
            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID format.");


            // ✅ Pass the Guid to FindAsync
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


    }
}
