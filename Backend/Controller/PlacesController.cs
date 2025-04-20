using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;


[Route("api/[controller]")]
[ApiController]
public class PlacesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PlacesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/places/by-district/3
    [HttpGet("by-district/{districtId}")]
    public async Task<ActionResult<IEnumerable<PlaceToVisit>>> GetPlacesByDistrict(int districtId)
    {
        var places = await _context.PlacesToVisit
            .Where(p => p.DistrictId == districtId)
            .ToListAsync();

        return Ok(places);
    }
}
