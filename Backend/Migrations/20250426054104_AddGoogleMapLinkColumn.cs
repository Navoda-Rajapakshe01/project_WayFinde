using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddGoogleMapLinkColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This migration adds GoogleMapLink column to PlacesToVisit table
            migrationBuilder.AddColumn<string>(
                name: "GoogleMapLink",
                table: "PlacesToVisit",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GoogleMapLink",
                table: "PlacesToVisit");
        }
    }
} 