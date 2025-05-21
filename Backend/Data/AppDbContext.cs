using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserNew> UsersNew { get; set; } = null!;
        public DbSet<Blog> Blogs { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Blog entity
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.Id);

            // Configure relationship between Blog and UserNew if needed
            // modelBuilder.Entity<Blog>()
            //     .HasOne<UserNew>()
            //     .WithMany()
            //     .HasForeignKey(b => b.UserId);
        }
    }
}