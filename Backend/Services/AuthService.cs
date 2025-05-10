using Backend.Data;
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
            // Check if username already exists
            if (await context.UsersNew.AnyAsync(u => u.Username == request.Username))
            {
                throw new Exception("Username is already taken.");
            }

            // Check if email already exists
            if (await context.UsersNew.AnyAsync(u => u.Email == request.Email))
            {
                throw new Exception("Email is already registered.");
            }

            // Create user and hash password
            var user = new UserNew
            {
                Username = request.Username,
                Email = request.Email,
                Role = "NormalUser",
                PasswordHash = new PasswordHasher<UserNew>().HashPassword(null, request.Password)
            };

            context.UsersNew.Add(user);
            await context.SaveChangesAsync();

            return user;
        }

        private string CreateToken(UserNew user)
        {
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role,user.Role)
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
