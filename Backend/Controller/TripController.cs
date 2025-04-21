using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


[Route("api/[controller]")]
[ApiController]
public class TripController : ControllerBase
{
    private readonly AppDbContext _context;

    public TripController(AppDbContext context)
    {
        _context = context;
    }

    // Save new trip
    [HttpPost]
    public async Task<ActionResult<Trip>> CreateTrip([FromBody] Trip trip)
    {
        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTrip", new { id = trip.Id }, trip);
    }

    // Get all trips (for upcoming trips display)
    [HttpGet]
    public ActionResult<IEnumerable<Trip>> GetTrips()
    {
        var trips = _context.Trips.ToList();
        return Ok(trips);
    }
}
