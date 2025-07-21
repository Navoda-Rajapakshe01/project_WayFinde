using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/activity")]
    public class ActivityOverviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ActivityOverviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetActivityOverview()
        {
            var now = DateTime.UtcNow;
            var months = Enumerable.Range(0, 6)
                .Select(i => now.AddMonths(-i))
                .Select(d => new { Year = d.Year, Month = d.Month })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToList();

            // Reviews per month
            var reviews = await _context.Reviews
                .Where(r => r.CreatedAt >= now.AddMonths(-5).AddDays(-now.Day + 1))
                .ToListAsync();
            var reviewsByMonth = reviews
                .GroupBy(r => new { r.CreatedAt.Year, r.CreatedAt.Month })
                .ToDictionary(g => (g.Key.Year, g.Key.Month), g => g.Count());

            // Signups per month
            var users = await _context.UsersNew
                .Where(u => u.RegisteredDate != null)
                .ToListAsync();
            var signupsByMonth = users
                .Where(u => DateTime.TryParse(u.RegisteredDate, out _))
                .GroupBy(u => {
                    var dt = DateTime.Parse(u.RegisteredDate ?? DateTime.MinValue.ToString("yyyy-MM-dd"));
                    return (dt.Year, dt.Month);
                })
                .ToDictionary(g => g.Key, g => g.Count());

            // Visits: If you have a Visits table, query it here. Otherwise, set to 0.
            // var visitsByMonth = ...

            var result = months.Select(m => new
            {
                month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(m.Month),
                reviews = reviewsByMonth.TryGetValue((m.Year, m.Month), out var rc) ? rc : 0,
                signups = signupsByMonth.TryGetValue((m.Year, m.Month), out var sc) ? sc : 0,
                visits = 0 // Replace with real data if available
            }).ToList();

            return Ok(result);
        }
    }
} 