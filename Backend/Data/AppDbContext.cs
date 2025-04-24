using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<VehicleReview> VehicleReviews { get; set; }
        public DbSet<VehicleReservation> VehicleReservations { get; set; }
        public DbSet<User> Users { get; set; }
        
        // DbSet for District
        public DbSet<District> Districts { get; set; }

        // DbSet for PlaceToVisit
        public DbSet<PlaceToVisit> PlacesToVisit { get; set; }

         // Add the TodoItem DbSet here
        public DbSet<TodoItem> TodoItems { get; set; }  // This is where we added it




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.PricePerDay)
                .HasPrecision(18, 2);

            modelBuilder.Entity<District>()
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);  

            modelBuilder.Entity<District>()
                .Property(d => d.ImageUrl)
                .IsRequired();

            modelBuilder.Entity<PlaceToVisit>()
                .Property(p => p.Name)
                .IsRequired();

            modelBuilder.Entity<PlaceToVisit>()
                .Property(p => p.MainImageUrl)
                .IsRequired();


            base.OnModelCreating(modelBuilder);
        }
    }
}
