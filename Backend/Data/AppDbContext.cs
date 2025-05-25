using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Vehicles
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<VehicleReview> VehicleReviews { get; set; }
        public DbSet<VehicleReservation> VehicleReservations { get; set; }
        public DbSet<VehicleAmenity> VehicleAmenities { get; set; }


        // Places & Districts
        public DbSet<District> Districts { get; set; }
        public DbSet<PlacesToVisit> PlacesToVisit { get; set; }
        public DbSet<Category> Categories { get; set; }

        // Todo
        public DbSet<TodoItem> TodoItems { get; set; }

        // Blogs
        public DbSet<BlogImage> BlogImages { get; set; }

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

            // DistrictWithPlacesCountDTO is a keyless DTO
            modelBuilder.Entity<DistrictWithPlacesCountDTO>().HasNoKey();

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
        }
    }
}
