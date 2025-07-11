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
        // Retrieves all dashboard notes from the database
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
                ProfilePictureUrl = users.TryGetValue(note.UserId, out var user2) ? user2.ProfilePictureUrl : null
            }).ToList();

            return Ok(result);
        }

        // GET: api/DashboardNotes/{id}
        // Retrieves a specific dashboard note by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<DashboardNote>> GetDashboardNote(int id)
        {
            var note = await _appDbContext.DashboardNote
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
                return NotFound();

            return Ok(note);
        }

        // GET: api/DashboardNote/trip/{tripId}
        // Retrieves all notes associated with a specific trip
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<DashboardNoteWithUserDTO>>> GetNotesByTrip(int tripId)
        {
            var trip = await _appDbContext.Trips.FindAsync(tripId);
            if (trip == null)
                return NotFound("Trip not found");

            var notes = await _appDbContext.DashboardNote
                .Where(n => n.TripId == tripId)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();

            var userIds = notes.Select(n => n.UserId).Distinct().ToList();
            var users = await _appDbContext.UsersNew
                                .Where(u => userIds.Contains(u.Id))
                                .ToDictionaryAsync(u => u.Id);

            var result = notes.Select(note => new DashboardNoteWithUserDTO
            {
                Id = note.Id,
                NoteTitle = note.NoteTitle,
                NoteDescription = note.NoteDescription,
                CreatedDate = note.CreatedDate,
                CreatedTime = note.CreatedTime,
                UserId = note.UserId,
                Username = users.TryGetValue(note.UserId, out var user) ? user.Username : "Unknown",
                ProfilePictureUrl = users.TryGetValue(note.UserId, out var user2) ? user2.ProfilePictureUrl : null
            }).ToList();

            return Ok(result);
        }

        // POST: api/DashboardNote
        // Creates a new dashboard note for a trip
        [HttpPost]
        public async Task<ActionResult<DashboardNote>> PostDashboardNote(DashboardNote note)
        {
            var trip = await _appDbContext.Trips.FindAsync(note.TripId);
            if (trip == null)
                return BadRequest("Invalid TripId");

            _appDbContext.DashboardNote.Add(note);
            await _appDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDashboardNote), new { id = note.Id }, note);
        }

        // PUT: api/DashboardNote/{id}
        // Updates an existing dashboard note
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
            existingNote.UpdatedAt = DateTime.UtcNow;

            _appDbContext.Entry(existingNote).State = EntityState.Modified;
            await _appDbContext.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/DashboardNote/{id}
        // Deletes a specific dashboard note
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
