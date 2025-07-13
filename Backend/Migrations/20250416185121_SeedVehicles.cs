using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedVehicles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "Brand", "Description", "FuelType", "IsAvailable", "Location", "Model", "NumberOfPassengers", "OwnerCity", "OwnerName", "PricePerDay", "TransmissionType", "Type" },
                values: new object[,]
                {
                    { 1, "Toyota", "A comfortable and fuel-efficient city car.", "Petrol", true, "Colombo", "Corolla", 5, "Colombo", "John Doe", 45.00m, "Automatic", "Sedan" },
                    { 2, "Suzuki", "Perfect for short family trips and hill country.", "Hybrid", true, "Kandy", "Wagon R", 4, "Kandy", "Jane Smith", 38.50m, "Automatic", "Mini Van" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
