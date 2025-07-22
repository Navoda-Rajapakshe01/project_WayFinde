using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/account-deletion")]
    public class AccountDeletionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        public AccountDeletionController(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // User requests account deletion
        [HttpPost("request")]
        public async Task<IActionResult> RequestDeletion([FromBody] Guid userId)
        {
            // Check if user exists
            var user = await _context.UsersNew.SingleOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found.");

            // Check for required fields
            if (string.IsNullOrEmpty(user.Username) ||
                string.IsNullOrEmpty(user.ContactEmail) ||
                string.IsNullOrEmpty(user.PasswordHash) ||
                string.IsNullOrEmpty(user.Role))
            {
                return BadRequest("User data is incomplete. Please contact support.");
            }

            // Check if a pending request already exists
            var existing = await _context.AccountDeletionRequests
                .FirstOrDefaultAsync(r => r.UserId == userId && r.Status == "Pending");
            if (existing != null)
                return BadRequest("A pending deletion request already exists.");

            var req = new AccountDeletionRequest
            {
                Id = 0, 
                UserId = userId,
                RequestedAt = DateTime.UtcNow,
                Status = "Pending",
                AdminReply = null
            };
            _context.AccountDeletionRequests.Add(req);
            await _context.SaveChangesAsync();
            // Send notification to admin
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", $"New account deletion request from user {userId}");
            return Ok(req);
        }

        // Admin: list all requests
        [HttpGet("requests")]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _context.AccountDeletionRequests
                .OrderByDescending(r => r.RequestedAt)
                .ToListAsync();
            return Ok(requests);
        }

        // Admin: approve request (delete user if allowed)
        [HttpPost("approve/{requestId}")]
        public async Task<IActionResult> ApproveRequest(int requestId)
        {
            var req = await _context.AccountDeletionRequests.FindAsync(requestId);
            if (req == null) return NotFound();
            if (req.Status != "Pending") return BadRequest("Request is not pending.");

            // Check for ongoing trips with bookings
            var now = DateTime.UtcNow;
            var hasOngoingTrips = await _context.Trips
                .AnyAsync(t => t.UserId == req.UserId && t.StartDate <= now && t.EndDate >= now);
            if (hasOngoingTrips)
                return BadRequest("User has ongoing trips with bookings. Cannot delete account.");

            // Delete user and mark request as approved
            var user = await _context.UsersNew.FindAsync(req.UserId);
            if (user != null)
                _context.UsersNew.Remove(user);
            req.Status = "Approved";
            req.AdminReply = null;
            await _context.SaveChangesAsync();
            return Ok("Account deleted and request approved.");
        }

        // Admin: decline request with reason
        [HttpPost("decline/{requestId}")]
        public async Task<IActionResult> DeclineRequest(int requestId, [FromBody] string reason)
        {
            var req = await _context.AccountDeletionRequests.FindAsync(requestId);
            if (req == null) return NotFound();
            if (req.Status != "Pending") return BadRequest("Request is not pending.");
            req.Status = "Declined";
            req.AdminReply = reason;
            await _context.SaveChangesAsync();
            return Ok("Request declined.");
        }

        // Allow user to delete their declined request
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var req = await _context.AccountDeletionRequests.FindAsync(id);
            if (req == null)
                return NotFound();
            _context.AccountDeletionRequests.Remove(req);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 