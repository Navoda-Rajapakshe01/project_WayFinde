using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<string?> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
            {
                return null;
            }
            if(new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                ==PasswordVerificationResult.Failed)
            {
                return BadRequest("Wrong Password");
            }
            string token = CreateToken(user);

            return Ok(token);

        public async Task<UserNew?> RegisterAsync(UserDto request)
        {
            if(await context.UsersNew.AnyAsync(u => u.Username == request.Username)) 
            { 
                return null;
            }
            var user = new UserNew();
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

            user.Username = request.Username;
            user.PasswordHash = hashedPassword;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(user);
        }
    }

}
