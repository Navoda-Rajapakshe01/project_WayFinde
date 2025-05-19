using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserDbContext context;
        private readonly IConfiguration configuration;

        public AuthService(UserDbContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }
        public async Task<string?> LoginAsync(UserDtoLogin request)
        {
            var user = await context.UsersNew.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
            {
                return null; // User not found
            }

            // Check if the password hash is null
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return null; // Treat missing password as login failure
            }

            // Check if the password is correct
            if (new PasswordHasher<UserNew>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
            {
                return null; // Treat wrong password as login failure
            }

            // Everything is correct - generate token
            return CreateToken(user);
        }


        public async Task<UserNew?> RegisterAsync(UserDtoRegister request)
        {
            try
            {
                // Check if username already exists
                if (await context.UsersNew.AnyAsync(u => u.Username == request.Username))
                {
                    throw new Exception("Username is already taken.");
                }

                // Check if email already exists
                if (await context.UsersNew.AnyAsync(u => u.ContactEmail == request.ContactEmail))
                {
                    throw new Exception("Email is already registered.");
                }

                // Create user and hash password
                var user = new UserNew
                {
                    Username = request.Username,
                    ContactEmail = request.ContactEmail,
                    Role = request.Role,
                    ServiceType = request.ServiceType ?? "", // Ensure ServiceType is never null
                    PasswordHash = new PasswordHasher<UserNew>().HashPassword(null, request.Password)
                };

                // Add user to context and save changes
                await context.UsersNew.AddAsync(user);

                // Save changes with explicit try/catch to get detailed error
                try
                {
                    await context.SaveChangesAsync();
                }
                catch (DbUpdateException dbEx)
                {
                    // Log the inner exception for debugging
                    Console.WriteLine($"Database error: {dbEx.InnerException?.Message}");
                    throw new Exception($"Database error: {dbEx.InnerException?.Message}");
                }

                return user;
            }
            catch (Exception ex)
            {
                // Re-throw with clear message
                throw new Exception($"User registration failed: {ex.Message}");
            }
        }

        private string CreateToken(UserNew user)
        {
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.ContactEmail),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role,user.Role),
                    new Claim("ServiceType", user.ServiceType ?? string.Empty),

                };
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
                );

            var tokenHandler = new JwtSecurityTokenHandler();
            string jwt = tokenHandler.WriteToken(tokenDescriptor);

            return jwt;


        }
    }

}