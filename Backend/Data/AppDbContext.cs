using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.DTOs;
using System.Text.Json;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserNew> UsersNew { get; set; } = null!;
        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<BlogImageNew> BlogImagesNew { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Blog entity
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.Id);

            // Configure relationship between Blog and UserNew if needed
            modelBuilder.Entity<Blog>()
             .HasOne(b => b.User)
             .WithMany(u => u.Blogs)
             .HasForeignKey(b => b.UserId);
            // Configure the ImageUrls property for Blog
            modelBuilder.Entity<Blog>()
                .Property(b => b.ImageUrls)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null));
        }
    }
}
