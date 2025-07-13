
using Backend.Models;
using Backend.DTOs;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Backend.Data;
using Microsoft.EntityFrameworkCore;




namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;
        private readonly AppDbContext _context;

        public AuthController(
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


        public static UserNew user = new()
        {
            Username = string.Empty,
            PasswordHash = string.Empty,
            Role = string.Empty
        };



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDtoRegister request)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.ContactEmail))
            {
                return BadRequest("Username, password, and email are required.");
            }

            try
            {
                var user = await _authService.RegisterAsync(request);
                if (user == null)
                {
                    return BadRequest("User already exists.");
                }

                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<string>> Login([FromBody] UserDtoLogin request)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            // Call the login service to authenticate the user and generate a token
            var token = await _authService.LoginAsync(request);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }
            // ✅ Set token in HttpOnly cookie
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,                // Use HTTPS in production
                SameSite = SameSiteMode.Strict, // Helps prevent CSRF
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });

            // Return the token to the frontend
            return Ok(new
            {
                message = "Login successful.",
                token = token
            });
        }

        [Authorize(Roles = "NormalUser")]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated!");
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("User ID is missing or invalid.");
            }
            var user = await _userService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.ContactEmail,
                user.Role,
                user.ServiceType
            });
        }




        [Authorize(Roles = "Admin")]
        [HttpGet("Admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are an admin!");
        }

        [Authorize]
        [HttpDelete("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);
            var user = await _context.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            _context.UsersNew.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully.");
        }



    }
}