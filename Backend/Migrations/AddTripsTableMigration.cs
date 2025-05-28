using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddTripsTableMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop existing table if it exists
            migrationBuilder.Sql("IF OBJECT_ID(N'dbo.Trips', N'U') IS NOT NULL DROP TABLE [dbo].[Trips]");

            // Create the table with correct data types
            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalSpend = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TripDistance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TripTime = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                });

            // Add any existing data with proper type conversion
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TripsBackup')
                BEGIN
                    INSERT INTO Trips (Name, Description, StartDate, EndDate, TotalSpend, TripDistance, TripTime, UserId)
                    SELECT 
                        Name,
                        Description,
                        StartDate,
                        EndDate,
                        CAST(REPLACE(TotalSpend, ',', '.') AS decimal(18,2)),
                        CAST(REPLACE(TripDistance, ',', '.') AS decimal(18,2)),
                        CAST(REPLACE(TripTime, ',', '.') AS decimal(18,2)),
                        UserId
                    FROM TripsBackup;
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trips");
        }
    }
} 