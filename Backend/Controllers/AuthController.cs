
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;



namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public static UserNew user = new()
        {
            Username = string.Empty,
            PasswordHash = string.Empty,
            Role = string.Empty
        };

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDtoRegister request)
        {
            // Basic validation
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.Email))
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

            // Return the token to the frontend
            return Ok(new
            {
                message = "Login successful.",
                token = token
            });
        }

        [Authorize(Roles = "normaluser")]
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
            var user = await _userService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Role,
                user.ServiceType
            });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null || !Guid.TryParse(userId, out Guid userGuid))
                return Unauthorized();

            var result = await _userService.UpdateUserAsync(userGuid, updateProfileDto.Username, updateProfileDto.Email, updateProfileDto.ProfilePictureUrl);
            if (!result) return NotFound("User not found");

            return Ok("Profile updated successfully");
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("Admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are an admin!");
        }


    }
}
