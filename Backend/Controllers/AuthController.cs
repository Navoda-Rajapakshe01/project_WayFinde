
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
    public class AuthController(IAuthService authService) : ControllerBase
    {
        public static UserNew user = new()
        {
            Username = string.Empty,
            PasswordHash = string.Empty,
            Role = string.Empty
        };

        [HttpPost("register")]
        public async Task<ActionResult<UserNew>> Register([FromBody] UserDtoRegister request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Username and password are required.");
            }

            var user = await authService.RegisterAsync(request);
            if (user == null)
            {
                return BadRequest("User already exists.");
            }

            return Ok(user);
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
            var token = await authService.LoginAsync(request);
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

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("Admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are an admin!");
        }


    }
}
