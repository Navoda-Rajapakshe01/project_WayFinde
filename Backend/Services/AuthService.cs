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
        public async Task<string?> LoginAsync(UserDto request)
        {
            var user = await context.UsersNew.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
            {
                return null;
            }
            // Check if the password hash is null
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return "Invalid password"; // Handle missing password hash
            }
            // Check if the password is correct

            if (new PasswordHasher<UserNew>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
            {
                return "Wrong Password";
            } 

            return CreateToken(user);
        }

        public async Task<UserNew?> RegisterAsync(UserDto request)
        {
            // Check if a user with the same username alread exists
            if (await context.UsersNew.AnyAsync(u => u.Username == request.Username)) 
            { 
                return null;
            }
            var user = new UserNew();
            var hashedPassword = new PasswordHasher<UserNew>()
                .HashPassword(user, request.Password);

            user.Username = request.Username;
            user.PasswordHash = hashedPassword;

            context.UsersNew.Add(user);
            await context.SaveChangesAsync();

            return user;
        }

        private string CreateToken(UserNew user)
        {
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
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
