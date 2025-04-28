using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models; 
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Data; 


[Route("api/[controller]")]
[ApiController]
public class DistrictController : ControllerBase
{
    private readonly AppDbContext _context;

    public DistrictController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/districts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<District>>> GetDistricts()
    {
        var districts = await _context.Districts.ToListAsync();
        return Ok(districts); 
    }
}
