using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Data.Migrations
{
    public partial class CleanupAndFixSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop TripPlaces table if it exists
            migrationBuilder.DropTable(
                name: "TripPlaces");

            // Drop TripPlaceQueue table if it exists
            migrationBuilder.DropTable(
                name: "TripPlaceQueue");

            // Fix decimal columns in Trips table
            migrationBuilder.Sql(@"
                -- First convert any invalid data to 0
                UPDATE Trips 
                SET TotalSpend = 0 
                WHERE ISNUMERIC(TotalSpend) = 0;
                
                UPDATE Trips 
                SET TripDistance = 0 
                WHERE ISNUMERIC(TripDistance) = 0;
                
                UPDATE Trips 
                SET TripTime = 0 
                WHERE ISNUMERIC(TripTime) = 0;
            ");

            // Alter columns to be decimal
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalSpend",
                table: "Trips",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TripDistance",
                table: "Trips",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TripTime",
                table: "Trips",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert decimal columns back to string
            migrationBuilder.AlterColumn<string>(
                name: "TotalSpend",
                table: "Trips",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "TripDistance",
                table: "Trips",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "TripTime",
                table: "Trips",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            // Recreate TripPlaces table
            migrationBuilder.CreateTable(
                name: "TripPlaces",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "int", nullable: false),
                    PlaceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripPlaces", x => new { x.TripId, x.PlaceId });
                });

            // Recreate TripPlaceQueue table
            migrationBuilder.CreateTable(
                name: "TripPlaceQueue",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripId = table.Column<int>(type: "int", nullable: false),
                    PlaceId = table.Column<int>(type: "int", nullable: false),
                    Processed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripPlaceQueue", x => x.Id);
                });
        }
    }
} 