using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Backend.Data;

namespace Backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20240320_AddTripPlacesTable")]
    partial class AddTripPlacesTable
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            modelBuilder.Entity("Backend.Models.TripPlace", b =>
                {
                    b.Property<int>("TripId")
                        .HasColumnType("int");

                    b.Property<int>("PlaceId")
                        .HasColumnType("int");

                    b.HasKey("TripId", "PlaceId");

                    b.HasIndex("PlaceId");

                    b.ToTable("TripPlaces");
                });

            modelBuilder.Entity("Backend.Models.TripPlace", b =>
                {
                    b.HasOne("Backend.Models.PlacesToVisit", "Place")
                        .WithMany("TripPlaces")
                        .HasForeignKey("PlaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Trip", "Trip")
                        .WithMany("TripPlaces")
                        .HasForeignKey("TripId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Place");
                    b.Navigation("Trip");
                });
        }
    }
} 