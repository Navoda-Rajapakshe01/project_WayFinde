using Backend.Models;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<UserNew?> RegisterAsync(UserDtoRegister request);
        Task<string?>LoginAsync(UserDtoLogin request);

    }
}
