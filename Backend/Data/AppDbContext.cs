


﻿using Backend.DTO;

﻿﻿using Microsoft.EntityFrameworkCore;



using Backend.Models;
using Backend.Models.User;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System.Text.Json;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        //Profile
        public DbSet<UserNew> UsersNew { get; set; } = null!;
        public DbSet<UserNew> UserNew { get; set; } = null!;
        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<Follows> Follows { get; set; } = null!;

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
        public DbSet<Review> Reviews { get; set; }
        public DbSet<PlaceImage> PlaceImages { get; set; }

        // Trip and TripPlace
        public DbSet<TripPlace> TripPlaces { get; set; }
        public DbSet<TripCollaborator> TripCollaborator { get; set; }
        public DbSet<TripDate> TripDate { get; set; }




        // Todo
        public DbSet<TodoItem> TodoItems { get; set; }

        // Blogs
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Comment> Comments { get; set; }

        // Travel Budget
        public DbSet<TravelBudget> TravelBudgets { get; set; }

        // Dashboard Notes
        public DbSet<DashboardNote> DashboardNote { get; set; }

        // Accommodations
        public DbSet<Accommodation> Accommodations { get; set; }
        public DbSet<AccommodationImage> AccommodationImages { get; set; }
        public DbSet<AccommodationReview> AccommodationReviews { get; set; }
        public DbSet<AccommodationReservation> AccommodationReservations { get; set; }


        public DbSet<AccommodationAmenity> AccommodationAmenities { get; set; }



        public DbSet<BlogReaction> BlogReactions { get; set; }
        public object? Amenities { get; internal set; }

        // TripDate
        public DbSet<TripDate> TripDate { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key for TripPlace
            modelBuilder.Entity<TripPlace>()
                .HasKey(tp => new { tp.TripId, tp.PlaceId });  // Composite key for TripPlace

            // Relationships between Trip and TripPlace
            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.Trip)
                .WithMany(t => t.TripPlaces)
                .HasForeignKey(tp => tp.TripId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete for Trip

            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.Place)
                .WithMany(p => p.TripPlaces)
                .HasForeignKey(tp => tp.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete for Place

            // Default Timestamps for Trip
            modelBuilder.Entity<Trip>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETDATE()");
            // DistrictWithPlacesCountDTO is a keyless DTO
            modelBuilder.Entity<DistrictWithPlacesCountDTO>().HasNoKey();

            modelBuilder.Entity<TripCollaborator>()
                .HasOne(tc => tc.Trip)
                .WithMany(t => t.Collaborators)
                .HasForeignKey(tc => tc.TripId)
                .OnDelete(DeleteBehavior.Cascade);  // deleting a trip deletes collaborators

            modelBuilder.Entity<TripCollaborator>()
                .HasOne(tc => tc.User)
                .WithMany() // assuming UserNew does not have a collection navigation property for collaborators
                .HasForeignKey(tc => tc.UserId)
                .OnDelete(DeleteBehavior.Restrict);  // prevent deleting users if they are collaborators


            // Precision for decimal properties
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.PricePerDay)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Trip>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Fix for TravelBudget.Amount precision
            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            // Districts Configuration
            // District configuration
            modelBuilder.Entity<District>()
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<District>()
                .Property(d => d.ImageUrl)
                .IsRequired();

            // PlacesToVisit Configuration
            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.Name)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.MainImageUrl)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.Description)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.DistrictId)
                .IsRequired();

            modelBuilder.Entity<PlacesToVisit>()
                .Property(p => p.CategoryId)
                .IsRequired();

            // Review Configuration
            // Review configuration
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            // TodoItem Configuration
            // TodoItem configuration
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

            // TravelBudget configuration
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
                .HasOne(t => t.Trip)
                .WithMany(t => t.TravelBudgets)
                .HasForeignKey(t => t.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            // TripPlace composite key
            modelBuilder.Entity<TripPlace>().HasKey(tp => new { tp.TripId, tp.PlaceId });

            // Blog configuration
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.Id);

            modelBuilder.Entity<Blog>()
                .HasOne(b => b.User)
                .WithMany(u => u.Blogs)
                .HasForeignKey(b => b.UserId);

            // Configure Blog ImageUrls with value comparer
            modelBuilder.Entity<Blog>()
                .Property(b => b.ImageUrls)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                    (c1, c2) => (c1 ?? new List<string>()).SequenceEqual(c2 ?? new List<string>()),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

            // Comment configuration
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Follows configuration (many-to-many relationship)
            modelBuilder.Entity<Follows>()
                .HasKey(f => new { f.FollowerID, f.FollowedID });

            modelBuilder.Entity<Follows>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Follows>()
                .HasOne(f => f.Followed)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FollowedID)
                .OnDelete(DeleteBehavior.Restrict);

            // TripDate configuration
            modelBuilder.Entity<TripDate>(entity =>
            {
                entity.ToTable("TripDate");

                entity.Property(e => e.Id)
                    .HasColumnName("TripDateId")
                    .UseIdentityColumn();

                entity.Property(e => e.TripId)
                    .IsRequired();

                entity.Property(e => e.PlaceId)
                    .IsRequired();

                entity.Property(e => e.StartDate)
                    .IsRequired();

                entity.Property(e => e.EndDate)
                    .IsRequired();
            });

            modelBuilder.Entity<TripDate>()
                .HasOne(td => td.Trip)
                .WithMany(t => t.TripDates)
                .HasForeignKey(td => td.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripDate>()
                .HasOne(td => td.Place)
                .WithMany()
                .HasForeignKey(td => td.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Additional TripDate configurations for better performance
            modelBuilder.Entity<TripDate>()
                .Property(td => td.StartDate)
                .IsRequired();

            modelBuilder.Entity<TripDate>()
                .Property(td => td.EndDate)
                .IsRequired();

            // Add index for better query performance
            modelBuilder.Entity<TripDate>()
                .HasIndex(td => new { td.TripId, td.PlaceId })
                .IsUnique();

            modelBuilder.Entity<TripDate>()
                .HasIndex(td => td.TripId);

            modelBuilder.Entity<TripDate>()
                .HasIndex(td => td.PlaceId);

            // Trip entity configuration
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
        }
    }
}