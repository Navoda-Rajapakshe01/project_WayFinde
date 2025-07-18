using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
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
        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<Post> Posts { get; set; } = null!;
        public DbSet<Follows> Follows { get; set; } = null!;

        // DbSets for your models
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
        public DbSet<Trip> Trips { get; set; }
        public DbSet<TripPlace> TripPlaces { get; set; }
        public DbSet<TripCollaborator> TripCollaborator { get; set; }
        public DbSet<UserNew> UserNew { get; set; }

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

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite Key for TripPlace
            modelBuilder.Entity<TripPlace>()
                .HasKey(tp => new { tp.TripId, tp.PlaceId });

            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.Trip)
                .WithMany(t => t.TripPlaces)
                .HasForeignKey(tp => tp.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TripPlace>()
                .HasOne(tp => tp.Place)
                .WithMany(p => p.TripPlaces)
                .HasForeignKey(tp => tp.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Trip timestamps
            modelBuilder.Entity<Trip>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Trip>()
                .Property(t => t.UpdatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Decimal precision
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.PricePerDay)
                .HasPrecision(18, 2);

            modelBuilder.Entity<TravelBudget>()
                .Property(t => t.Amount)
                .HasPrecision(18, 2);

            // District & Places config
            modelBuilder.Entity<District>()
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<District>()
                .Property(d => d.ImageUrl)
                .IsRequired();

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

            // Review config
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Todo config
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

            // TravelBudget config
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

            // DashboardNote config
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

            // Blog config
            modelBuilder.Entity<Blog>()
                .HasKey(b => b.Id);

            modelBuilder.Entity<Blog>()
                .HasOne(b => b.User)
                .WithMany(u => u.Blogs)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Blog>()
                .Property(b => b.ImageUrls)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));

            // Comment config
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Follows config
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

            // Vehicle Supplier relation
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Supplier)
                .WithMany()
                .HasForeignKey(v => v.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // BlogReaction config – Fix for multiple cascade paths
            modelBuilder.Entity<BlogReaction>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BlogReaction>()
                .HasOne(r => r.Blog)
                .WithMany()
                .HasForeignKey(r => r.BlogId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlogReaction>()
                .HasIndex(r => new { r.BlogId, r.UserId })
                .IsUnique();

            // Accommodation relationships
            modelBuilder.Entity<Accommodation>()
                .HasMany(a => a.Images)
                .WithOne(i => i.Accommodation)
                .HasForeignKey(i => i.AccommodationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Accommodation>()
                .HasMany(a => a.Reviews)
                .WithOne(r => r.Accommodation)
                .HasForeignKey(r => r.AccommodationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Accommodation>()
                .HasMany(a => a.Amenities)
                .WithOne(am => am.Accommodation)
                .HasForeignKey(am => am.AccommodationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Accommodation>()
                .HasOne(a => a.Supplier)
                .WithMany()
                .HasForeignKey(a => a.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // DTO without key
            modelBuilder.Entity<DistrictWithPlacesCountDTO>().HasNoKey();
        }
    }
}
