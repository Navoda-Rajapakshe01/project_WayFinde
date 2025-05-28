using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Data.Migrations
{
    public partial class FixTripDecimalColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, convert any existing string values to decimal
            migrationBuilder.Sql(@"
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

            // Then alter the columns to ensure they are decimal(18,2)
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
        }
    }
} 