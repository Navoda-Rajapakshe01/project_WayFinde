using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserNew> GetUserByIdAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedId))
            {
                return null; // or throw an exception if appropriate
            }

            return await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == parsedId);
        }

        public async Task<bool> UpdateUserAsync(Guid userId, string username, string email, string profilePicture)
        {
            var user = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;

            user.Username = username;
            user.ContactEmail = email;
            user.ProfilePictureUrl = profilePicture;

            await _context.SaveChangesAsync();
            return true;
        }


    }
}