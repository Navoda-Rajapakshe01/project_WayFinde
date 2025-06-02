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

        public DbSet<Comment> Comments { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        //// Vehicles
        //public DbSet<Vehicle> Vehicles { get; set; }
        //public DbSet<VehicleImage> VehicleImages { get; set; }
        //public DbSet<VehicleReview> VehicleReviews { get; set; }
        //public DbSet<VehicleReservation> VehicleReservations { get; set; }

        // Places & Districts
       // public DbSet<District> Districts { get; set; }
        public DbSet<PlacesToVisit> PlacesToVisit { get; set; }
       // public DbSet<Category> Categories { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PlaceImage> PlaceImages { get; set; }

        // Todo
        //public DbSet<TodoItem> TodoItems { get; set; }

        //// Blogs
        //public DbSet<BlogImage> BlogImages { get; set; }
        //public DbSet<Blog> Blogs { get; set; }

        // Travel Budget
       // public DbSet<TravelBudget> TravelBudgets { get; set; }

        //Dashboard Notes (NEW)
        public DbSet<DashboardNote> DashboardNote { get; set; }

        // Accommodations
        //public DbSet<Accommodation> Accommodations { get; set; }
        //public DbSet<AccommodationImage> AccommodationImages { get; set; }
        //public DbSet<AccommodationReview> AccommodationReviews { get; set; }
        //public DbSet<AccommodationReservation> AccommodationReservations { get; set; }
        public object Amenities { get; internal set; }


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

                    modelBuilder.Entity<Comment>()
               .HasOne(c => c.User)
               .WithMany()
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Restrict); // <== Fix for cascade cycle

            


            // PlacesToVisit
            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.Name)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.MainImageUrl)
                .IsRequired();

           

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

           

            // DashboardNote rules

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.NoteTitle)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.NoteDescription)
                .IsRequired();

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.CreatedDate)
                .IsRequired();

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.CreatedTime)
                .IsRequired();

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.UserId)
                .IsRequired();


        }
    }
}
