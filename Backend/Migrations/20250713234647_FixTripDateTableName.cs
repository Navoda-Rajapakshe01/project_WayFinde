using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixTripDateTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDates_PlacesToVisit_PlaceId",
                table: "TripDates");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDates_Trips_TripId",
                table: "TripDates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TripDates",
                table: "TripDates");

            migrationBuilder.RenameTable(
                name: "TripDates",
                newName: "TripDate");

            migrationBuilder.RenameIndex(
                name: "IX_TripDates_TripId",
                table: "TripDate",
                newName: "IX_TripDate_TripId");

            migrationBuilder.RenameIndex(
                name: "IX_TripDates_PlaceId",
                table: "TripDate",
                newName: "IX_TripDate_PlaceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TripDate",
                table: "TripDate",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TripDate_TripId_PlaceId",
                table: "TripDate",
                columns: new[] { "TripId", "PlaceId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDate_PlacesToVisit_PlaceId",
                table: "TripDate",
                column: "PlaceId",
                principalTable: "PlacesToVisit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDate_Trips_TripId",
                table: "TripDate",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TripDate_PlacesToVisit_PlaceId",
                table: "TripDate");

            migrationBuilder.DropForeignKey(
                name: "FK_TripDate_Trips_TripId",
                table: "TripDate");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TripDate",
                table: "TripDate");

            migrationBuilder.DropIndex(
                name: "IX_TripDate_TripId_PlaceId",
                table: "TripDate");

            migrationBuilder.RenameTable(
                name: "TripDate",
                newName: "TripDates");

            migrationBuilder.RenameIndex(
                name: "IX_TripDate_TripId",
                table: "TripDates",
                newName: "IX_TripDates_TripId");

            migrationBuilder.RenameIndex(
                name: "IX_TripDate_PlaceId",
                table: "TripDates",
                newName: "IX_TripDates_PlaceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TripDates",
                table: "TripDates",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TripDates_PlacesToVisit_PlaceId",
                table: "TripDates",
                column: "PlaceId",
                principalTable: "PlacesToVisit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripDates_Trips_TripId",
                table: "TripDates",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
