using Backend.Models;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<UserNew?> RegisterAsync(UserDto request);
        Task<string?>loginAsync(UserDto request);

    }
}
