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
    
    [ApiController] 
    [Route("api/[controller]")]
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

            var result = await _userService.UpdateUserAsync(
                userGuid,
                updateProfileDto.Username,
                updateProfileDto.ContactEmail,
                updateProfileDto.ProfilePictureUrl ?? string.Empty);
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


            // Fetch blogs created by this user
            var userBlogs = await _context.Blogs
                .Where(b => b.UserId == userId)
                .Select(b => new
                {
                    b.Title,
                    b.Author,
                    b.Id,
                    b.Location,
                    BlogUrl = b.BlogUrl,
                    CoverImageUrl = b.CoverImageUrl,
                    b.CreatedAt
                })
                .ToListAsync();

            // Get blog count
            int blogCount = userBlogs.Count;

            return Ok(new
            {
                user.Id,
                user.Username,
                user.ContactEmail,
                user.Bio,
                user.ProfilePictureUrl,
                FollowersCount = user.FollowersCount,
                FollowingCount = user.FollowingCount,
                BlogCount = blogCount,
                Blogs = userBlogs
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

        // Controllers/ProfileController.cs

        // POST: api/profile/{userId}/follow
        [HttpPost("{userId}/follow")]
        [Authorize]
        public async Task<IActionResult> FollowUser(Guid userId)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (currentUserIdClaim == null)
                return Unauthorized();

            if (!Guid.TryParse(currentUserIdClaim.Value, out Guid currentUserId))
                return BadRequest("Invalid user ID format");

            // Don't allow following yourself
            if (userId == currentUserId)
                return BadRequest("You cannot follow yourself");

            // Find both users
            var currentUser = await _context.UsersNew.FindAsync(currentUserId);
            var targetUser = await _context.UsersNew.FindAsync(userId);

            if (targetUser == null)
                return NotFound("User not found");

            // Check if already following
            var existingFollow = await _context.Follows
                .FirstOrDefaultAsync(uf => uf.FollowerID == currentUserId && uf.FollowedID == userId);

            if (existingFollow != null)
            {
                // Already following, so unfollow
                _context.Follows.Remove(existingFollow);

                // Decrement counters
                targetUser.FollowersCount = Math.Max(0, targetUser.FollowersCount - 1);
                if (currentUser != null)
                {
                    currentUser.FollowingCount = Math.Max(0, currentUser.FollowingCount - 1);
                }

                await _context.SaveChangesAsync();

                return Ok(new { following = false, followerCount = targetUser.FollowersCount });
            }

            // Not following, so follow
            var followerUser = await _context.UsersNew.FindAsync(currentUserId);
            var followedUser = await _context.UsersNew.FindAsync(userId);

            if (followerUser == null || followedUser == null)
                return NotFound("One or both users not found.");

            _context.Follows.Add(new Follows
            {
                FollowerID = currentUserId,
                FollowedID = userId,
                FollowDate = DateTime.UtcNow,
                Follower = followerUser,
                Followed = followedUser
            });

            // Increment counters
            targetUser.FollowersCount++;
            if (currentUser != null)
            {
                currentUser.FollowingCount++;
            }

            await _context.SaveChangesAsync();

            return Ok(new { following = true, followerCount = targetUser.FollowersCount });
        }
        [HttpGet("{userId}/followers/count")]
        public async Task<ActionResult<int>> GetFollowersCount(Guid userId)
        {
            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(user.FollowersCount);
        }

        [HttpGet("{userId}/following/count")]
        public async Task<ActionResult<int>> GetFollowingCount(Guid userId)
        {
            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            return Ok(user.FollowingCount);
        }

        // GET: api/profile/{userId}/following/status
        [HttpGet("{userId}/following/status")]
        [Authorize]
        public async Task<ActionResult<bool>> CheckFollowingStatus(Guid userId)
        {
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (currentUserIdClaim == null)
                return Unauthorized();

            if (!Guid.TryParse(currentUserIdClaim.Value, out Guid currentUserId))
                return BadRequest("Invalid user ID format");

            bool isFollowing = await _context.Follows
                .AnyAsync(uf => uf.FollowerID == currentUserId && uf.FollowedID == userId);

            return Ok(isFollowing);
        }

        [HttpPost("admin/sync-follow-counts")]
        [Authorize(Roles = "Admin")] // Restrict to admin users
        public async Task<IActionResult> SyncFollowCounts()
        {
            // Get all users
            var users = await _context.UsersNew.ToListAsync();

            foreach (var user in users)
            {
                // Count followers
                var followerCount = await _context.Follows
                    .CountAsync(uf => uf.FollowedID == user.Id);

                // Count following
                var followingCount = await _context.Follows
                    .CountAsync(uf => uf.FollowerID == user.Id);

                // Update user counts
                user.FollowersCount = followerCount;
                user.FollowingCount = followingCount;
            }

            // Save all changes at once
            await _context.SaveChangesAsync();

            return Ok(new { message = "Follow counts synchronized successfully" });
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUserCount()
        {
            var count = await _context.UsersNew.CountAsync();
            return Ok(count);
        }

        // GET: api/profile/admin/users
        [HttpGet("admin/users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.UsersNew
                    .Select(u => new
                    {
                        Id = u.Id,
                        FullName = u.Username,
                        Email = u.ContactEmail,
                        Role = u.Role,
                        Status = "active", 
                        DateJoined = u.RegisteredDate,
                        LastLogin = u.LastLoginDate,
                        ProfilePicture = u.ProfilePictureUrl,
                        Phone = u.PhoneNumber,
                        Bio = u.Bio,
                        FollowersCount = u.FollowersCount,
                        FollowingCount = u.FollowingCount
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch users", error = ex.Message });
            }
        }

        // GET: api/profile/admin/users/{userId}
        [HttpGet("admin/users/{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            try
            {
                var user = await _context.UsersNew
                    .Where(u => u.Id == userId)
                    .Select(u => new
                    {
                        Id = u.Id,
                        FullName = u.Username,
                        Email = u.ContactEmail,
                        Role = u.Role,
                        Status = "active", 
                        DateJoined = u.RegisteredDate,
                        LastLogin = u.LastLoginDate,
                        ProfilePicture = u.ProfilePictureUrl,
                        Phone = u.PhoneNumber,
                        Bio = u.Bio,
                        FollowersCount = u.FollowersCount,
                        FollowingCount = u.FollowingCount
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                    return NotFound("User not found");

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to fetch user", error = ex.Message });
            }
        }

    }
}
