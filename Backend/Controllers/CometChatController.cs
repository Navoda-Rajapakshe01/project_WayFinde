using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Backend.Services;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/cometchat")]
    public class CometChatController : ControllerBase
    {
        private readonly CometChatService _cometChatService;
        private readonly AppDbContext _context;

        public CometChatController(CometChatService cometChatService, AppDbContext context)
        {
            _cometChatService = cometChatService;
            _context = context;
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            var result = await _cometChatService.CreateUserAsync(request.Uid, request.Name);
            if (result)
                return Ok();
            return StatusCode(500, "Failed to create user in CometChat");
        }

        [HttpPost("sync-all-users")]
        public async Task<IActionResult> SyncAllUsers()
        {
            // Fetch all users from the database
            var users = await _context.UsersNew.ToListAsync();
            int success = 0, failed = 0;
            foreach (var user in users)
            {
                var result = await _cometChatService.CreateUserAsync(user.Id.ToString(), user.Username);
                if (result) success++;
                else failed++;
            }
            return Ok(new { success, failed, total = users.Count });
        }
    }

    public class CreateUserRequest
    {
        public required string Uid { get; set; }
        public required string Name { get; set; }
    }
} 