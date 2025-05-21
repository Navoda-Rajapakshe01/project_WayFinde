using Microsoft.EntityFrameworkCore;
using Backend.Models;

using Backend.DTOs;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserNew> UsersNew { get; set; } = null!;
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        
        
    }
}
