using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<UserNew> GetUserByIdAsync(string userId);
        Task<bool> UpdateUserAsync(Guid userId, string username, string email, string profilePicture);
        //Task<bool> DeleteUserAsync(Guid userId);
        //Task<bool> DeleteUserAsync(string userId);
    }
}