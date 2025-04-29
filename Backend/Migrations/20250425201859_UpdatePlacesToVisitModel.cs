using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlacesToVisitModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "PlacesToVisit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GoogleMapLink",
                table: "PlacesToVisit",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "History",
                table: "PlacesToVisit",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OpeningHours",
                table: "PlacesToVisit",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "PlacesToVisit");

            migrationBuilder.DropColumn(
                name: "GoogleMapLink",
                table: "PlacesToVisit");

            migrationBuilder.DropColumn(
                name: "History",
                table: "PlacesToVisit");

            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "PlacesToVisit");
        }
    }
}
