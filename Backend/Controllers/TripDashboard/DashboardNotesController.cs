using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;  

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardNoteController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
    

        public DashboardNoteController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
           
        }

        // GET: api/DashboardNotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardNoteWithUserDTO>>> GetDashboardNotes()
        {
            // Get all notes
            var notes = await _appDbContext.DashboardNote.ToListAsync();

            // Get all users whose IDs are in notes (to reduce DB calls)
            var userIds = notes.Select(n => n.UserId).Distinct().ToList();
            var users = await _appDbContext.UsersNew
                            .Where(u => userIds.Contains(u.Id))
                            .ToDictionaryAsync(u => u.Id);

            // Map to DTO combining note + user info
            var result = notes.Select(note => new DashboardNoteWithUserDTO
            {
                Id = note.Id,
                NoteTitle = note.NoteTitle,
                NoteDescription = note.NoteDescription,
                CreatedDate = note.CreatedDate,
                CreatedTime = note.CreatedTime,
                UserId = note.UserId,
                Username = users.TryGetValue(note.UserId, out var user) ? user.Username : "Unknown",
                UrlImages = users.TryGetValue(note.UserId, out var user2) ? user2.ProfilePictureUrl : null
            }).ToList();

            return Ok(result);
        }

        // GET: api/DashboardNotes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DashboardNoteWithUserDTO>> GetDashboardNote(int id)
        {
            var note = await _appDbContext.DashboardNote.FindAsync(id);
            if (note == null)
                return NotFound();

            var user = await _appDbContext.UsersNew.FindAsync(note.UserId);
            if (user == null)
                return NotFound("User not found");

            var dto = new DashboardNoteWithUserDTO
            {
                Id = note.Id,
                NoteTitle = note.NoteTitle,
                NoteDescription = note.NoteDescription,
                CreatedDate = note.CreatedDate,
                CreatedTime = note.CreatedTime,
                UserId = note.UserId,
                Username = user.Username,
                UrlImages = user.ProfilePictureUrl
            };

            return Ok(dto);
        }

        // GET: api/DashboardNote/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<DashboardNoteWithUserDTO>>> GetNotesByUser(Guid userId)
        {
            var notes = await _appDbContext.DashboardNote
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedDate)
                .ThenByDescending(n => n.CreatedTime)
                .ToListAsync();

            var user = await _appDbContext.UsersNew.FindAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var result = notes.Select(note => new DashboardNoteWithUserDTO
            {
                Id = note.Id,
                NoteTitle = note.NoteTitle,
                NoteDescription = note.NoteDescription,
                CreatedDate = note.CreatedDate,
                CreatedTime = note.CreatedTime,
                UserId = user.Id,
                Username = user.Username,
                UrlImages = user.ProfilePictureUrl
            }).ToList();

            return Ok(result);
        }

        // POST: api/DashboardNote
        [HttpPost]
        public async Task<ActionResult<DashboardNote>> PostDashboardNote(DashboardNote note)
        {
            note.CreatedDate = DateTime.UtcNow.Date;
            note.CreatedTime = DateTime.UtcNow.TimeOfDay;

            _appDbContext.DashboardNote.Add(note);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDashboardNote), new { id = note.Id }, note);
        }

        // PUT: api/DashboardNote/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDashboardNote(int id, DashboardNote updatedNote)
        {
            if (id != updatedNote.Id)
                return BadRequest();

            var existingNote = await _appDbContext.DashboardNote.FindAsync(id);
            if (existingNote == null)
                return NotFound();

            existingNote.NoteTitle = updatedNote.NoteTitle;
            existingNote.NoteDescription = updatedNote.NoteDescription;

            _appDbContext.Entry(existingNote).State = EntityState.Modified;
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/DashboardNote/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDashboardNote(int id)
        {
            var note = await _appDbContext.DashboardNote.FindAsync(id);
            if (note == null)
                return NotFound();

            _appDbContext.DashboardNote.Remove(note);
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
