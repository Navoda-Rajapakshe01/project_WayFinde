using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSavedAccommodationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedVehicles_Trips_TripId",
                table: "SavedVehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_SavedVehicles_Vehicles_VehicleId",
                table: "SavedVehicles");

            migrationBuilder.DropIndex(
                name: "IX_SavedVehicles_VehicleId",
                table: "SavedVehicles");

            migrationBuilder.CreateTable(
                name: "SavedAccommodations",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "int", nullable: false),
                    AccommodationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavedAccommodations", x => new { x.TripId, x.AccommodationId });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavedAccommodations");

            migrationBuilder.CreateIndex(
                name: "IX_SavedVehicles_VehicleId",
                table: "SavedVehicles",
                column: "VehicleId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedVehicles_Trips_TripId",
                table: "SavedVehicles",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SavedVehicles_Vehicles_VehicleId",
                table: "SavedVehicles",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
