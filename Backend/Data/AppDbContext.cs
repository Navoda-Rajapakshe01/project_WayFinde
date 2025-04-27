using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //vehicles
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<VehicleReview> VehicleReviews { get; set; }
        public DbSet<VehicleReservation> VehicleReservations { get; set; }


        //Accommodations
        public DbSet<Accommodation> Accommodations { get; set; }
        public DbSet<AccommodationImage> AccommodationImages { get; set; }
        public DbSet<AccommodationReview> AccommodationReviews { get; set; }
        public DbSet<AccommodationReservation> AccommodationReservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Vehicle Price Precision
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.PricePerDay)
                .HasPrecision(18, 2);

            // Accommodation Price Precision
            modelBuilder.Entity<Accommodation>()
                .Property(a => a.PricePerDay)
                .HasPrecision(18, 2);


            // Seed sample vehicle data
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

            // Seed sample accommodation data
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
                    Description ="stay in free, make your day comforable",
                    PricePerDay = 56900m,
                    IsAvailable = true
                },
                new Accommodation
                {
                    Id = 2,
                    Name = "Sajeew Paradaise",
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
        }
    }
}
