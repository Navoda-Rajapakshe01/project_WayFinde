using Microsoft.EntityFrameworkCore;
using Backend.Models;
namespace Backend.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
    {
        public DbSet<UserNew> UsersNew { get; set; } = null!;
        //public DbSet<User> Users { get; set; } = null!;
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<UserNew>()
        //        .HasKey(u => u.Id);
        //    modelBuilder.Entity<User>()
        //        .HasKey(u => u.Id);
        //}
    }
  
}
