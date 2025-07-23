using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<UserNew?> GetUserByIdAsync(string userId);
        Task<bool> UpdateUserAsync(Guid userId, string username, string email, string profilePictureUrl);

    }
}