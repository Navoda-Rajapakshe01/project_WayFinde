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

        // Trips
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripPlace> TripPlaces { get; set; }

        // Users
        public DbSet<User> Users { get; set; }

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

            // Configure TripPlaces trigger
            modelBuilder.Entity<Trip>()
                .ToTable("Trips", t => t.HasTrigger("InsertTripPlacesAfterTripInsert"));

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

            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<TravelBudget>()
                .HasOne<Trip>()
                .WithMany()
                .HasForeignKey(t => t.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            // Trip
            modelBuilder.Entity<Trip>(entity =>
            {
                entity.ToTable("Trips");

                entity.Property(e => e.Id)
                    .HasColumnName("Id")
                    .UseIdentityColumn();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.StartDate)
                    .IsRequired();

                entity.Property(e => e.EndDate)
                    .IsRequired();

                entity.Property(e => e.TotalSpend)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.TripDistance)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.TripTime)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(e => e.UserId)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("GETDATE()")
                    .ValueGeneratedOnAddOrUpdate();
            });

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(u => u.FullName)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(u => u.UpdatedAt)
                    .HasDefaultValueSql("GETDATE()");
            });

            // DashboardNote rules
            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.NoteTitle)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.NoteDescription)
                .IsRequired();

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<DashboardNote>()
                .Property(d => d.TripId)
                .IsRequired();

            modelBuilder.Entity<DashboardNote>()
                .HasOne<Trip>()
                .WithMany()
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            // TripPlace composite key
            modelBuilder.Entity<TripPlace>().HasKey(tp => new { tp.TripId, tp.PlaceId });
        }
    }
}
