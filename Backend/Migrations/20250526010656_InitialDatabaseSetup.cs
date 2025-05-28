using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialDatabaseSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "TravelBudgets",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_TravelBudgets_TripId",
                table: "TravelBudgets",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_TravelBudgets_Trips_TripId",
                table: "TravelBudgets",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TravelBudgets_Trips_TripId",
                table: "TravelBudgets");

            migrationBuilder.DropIndex(
                name: "IX_TravelBudgets_TripId",
                table: "TravelBudgets");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "TravelBudgets",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");
        }
    }
}
