using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DistrictController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DistrictController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDistrictsWithPlacesCount()
        {
            var result = await _context.Districts
                .Select(d => new DistrictWithPlacesCountDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    ImageUrl = d.ImageUrl,
                    Slug = d.Slug,
                    PlacesCount = _context.PlacesToVisit.Count(p => p.DistrictId == d.Id)  // Get count of places directly
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}