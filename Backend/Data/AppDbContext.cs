using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.DTOs;
using System.Text.Json;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserNew> UsersNew { get; set; } = null!;

        public DbSet<BlogImageNew> BlogImagesNew { get; set; } = null!;

        public DbSet<Comment> Comments { get; set; } = null!;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        // Vehicles
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<VehicleReview> VehicleReviews { get; set; }
        public DbSet<VehicleReservation> VehicleReservations { get; set; }

        // Places & Districts
        public DbSet<District> Districts { get; set; }
        public DbSet<PlacesToVisit> PlacesToVisit { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PlaceImage> PlaceImages { get; set; }

        // Todo
        public DbSet<TodoItem> TodoItems { get; set; }

        // Blogs
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Blog> Blogs { get; set; } = null!;

        // Travel Budget
        public DbSet<TravelBudget> TravelBudgets { get; set; }

        //Dashboard Notes (NEW)
        public DbSet<DashboardNote> DashboardNote { get; set; }

        // Accommodations
        public DbSet<Accommodation> Accommodations { get; set; }
        public DbSet<AccommodationImage> AccommodationImages { get; set; }
        public DbSet<AccommodationReview> AccommodationReviews { get; set; }
        public DbSet<AccommodationReservation> AccommodationReservations { get; set; }
        public object Amenities { get; internal set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Blog entity
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.Id);


            // Configure relationship between Blog and UserNew if needed
<<<<<<<<< Temporary merge branch 1
            // modelBuilder.Entity<Blog>()
            //     .HasOne<UserNew>()
            //     .WithMany()
            //     .HasForeignKey(b => b.UserId);
=======
            // Precision for PricePerDay
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.PricePerDay)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Accommodation>()
                .Property(a => a.PricePerDay)
                .HasPrecision(18, 2);

            // Seed Vehicles
            modelBuilder.Entity<Vehicle>().HasData(
                new Vehicle
                {
                    Id = 1,
                    Brand = "Toyota",
                    Model = "Corolla",
                    Type = "Sedan",
                    NumberOfPassengers = 5,
                    FuelType = "Petrol",
                    TransmissionType = "Automatic",
                    Location = "Colombo",
                    OwnerName = "John Doe",
                    OwnerCity = "Colombo",
                    Description = "A comfortable and fuel-efficient city car.",
                    PricePerDay = 45.00m,
                    IsAvailable = true
                },
                new Vehicle
                {
                    Id = 2,
                    Brand = "Suzuki",
                    Model = "Wagon R",
                    Type = "Mini Van",
                    NumberOfPassengers = 4,
                    FuelType = "Hybrid",
                    TransmissionType = "Automatic",
                    Location = "Kandy",
                    OwnerName = "Jane Smith",
                    OwnerCity = "Kandy",
                    Description = "Perfect for short family trips and hill country.",
                    PricePerDay = 38.50m,
                    IsAvailable = true
                }
            );

            // Seed Accommodations
            modelBuilder.Entity<Accommodation>().HasData(
                new Accommodation
                {
                    Id = 1,
                    Name = "Earl's Regency",
                    Type = "Hotel",
                    NumberOfGuests = 100,
                    NumberOfBedRooms = 20,
                    NumberOfBeds = 60,
                    NumberOfBathRooms = 40,
                    Location = "Thennekumbura",
                    OwnerName = "Earl's regency group",
                    OwnerCity = "Kandy",
                    Description = "stay in free, make your day comfortable",
                    PricePerDay = 56900m,
                    IsAvailable = true
                },
                new Accommodation
                {
                    Id = 2,
                    Name = "Sajeew Paradise",
                    Type = "Cabana suite",
                    NumberOfGuests = 8,
                    NumberOfBedRooms = 3,
                    NumberOfBeds = 4,
                    NumberOfBathRooms = 3,
                    Location = "Oruthota",
                    OwnerName = "Sajeewa Karalliyadda",
                    OwnerCity = "Rajawella",
                    Description = "happy holiday",
                    PricePerDay = 14900m,
                    IsAvailable = true
                }
            );

            // District
            modelBuilder.Entity<District>()
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<District>()
                .Property(d => d.ImageUrl)
                .IsRequired();

            // PlacesToVisit
            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.Name)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.MainImageUrl)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoItem
            modelBuilder.Entity<TodoItem>()
                .Property(t => t.TaskName)
                .IsRequired()
                .HasMaxLength(150);

            modelBuilder.Entity<TodoItem>()
                .Property(t => t.TaskStatus)
                .IsRequired();

            modelBuilder.Entity<TodoItem>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<TodoItem>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // TravelBudget
            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.Description)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.Amount)
                .IsRequired();

            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

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
>>>>>>> update-v2

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



>>>>>>>>> Temporary merge branch 2
        }
    }
}
