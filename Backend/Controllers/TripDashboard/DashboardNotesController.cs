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
        private readonly AppDbContext _context;

        public DashboardNoteController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DashboardNotes
        // Retrieves all dashboard notes from the database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardNote>>> GetDashboardNotes()
        {
            var notes = await _context.DashboardNote
                .Select(note => new DashboardNote
                {
                    Id = note.Id,
                    NoteTitle = note.NoteTitle,
                    NoteDescription = note.NoteDescription,
                    CreatedAt = note.CreatedAt,
                    UpdatedAt = note.UpdatedAt,
                    TripId = note.TripId
                })
                .ToListAsync();

            return Ok(notes);
        }

        // GET: api/DashboardNotes/{id}
        // Retrieves a specific dashboard note by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<DashboardNote>> GetDashboardNote(int id)
        {
            var note = await _context.DashboardNote
                .FirstOrDefaultAsync(n => n.Id == id);

            if (note == null)
                return NotFound();

            return Ok(note);
        }

        // GET: api/DashboardNote/trip/{tripId}
       [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<IEnumerable<DashboardNote>>> GetNotesByTrip(int tripId)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                    return NotFound("Trip not found");

                var notes = await _context.DashboardNote
                    .Where(n => n.TripId == tripId)
                    .OrderByDescending(n => n.CreatedAt)
                    .ToListAsync();

                return Ok(notes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        // POST: api/DashboardNote
        // Creates a new dashboard note for a trip
        [HttpPost]
        public async Task<ActionResult<DashboardNote>> PostDashboardNote(DashboardNote note)
        {
            var trip = await _context.Trips.FindAsync(note.TripId);
            if (trip == null)
                return BadRequest("Invalid TripId");

            _context.DashboardNote.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDashboardNote), new { id = note.Id }, note);
        }

        // PUT: api/DashboardNote/{id}
        // Updates an existing dashboard note
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDashboardNote(int id, DashboardNote updatedNote)
        {
            if (id != updatedNote.Id)
                return BadRequest();

            var existingNote = await _context.DashboardNote.FindAsync(id);
            if (existingNote == null)
                return NotFound();

            existingNote.NoteTitle = updatedNote.NoteTitle;
            existingNote.NoteDescription = updatedNote.NoteDescription;
            existingNote.UpdatedAt = DateTime.UtcNow;

            _context.Entry(existingNote).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
       

        // PATCH: api/DashboardNote/5  (partial update: title and/or description)
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchDashboardNote(int id, [FromBody] PatchDashboardNoteDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var note = await _context.DashboardNote.FindAsync(id);
            if (note is null)
                return NotFound("Dashboard note not found");

            if (dto.NoteTitle is not null)
                note.NoteTitle = dto.NoteTitle.Trim();

            if (dto.NoteDescription is not null)
                note.NoteDescription = dto.NoteDescription.Trim();

            note.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(note);
        }
        
        // DELETE: api/DashboardNote/{id}
        // Deletes a specific dashboard note
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDashboardNote(int id)
        {
            var note = await _context.DashboardNote.FindAsync(id);
            if (note == null)
                return NotFound();

            _context.DashboardNote.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}