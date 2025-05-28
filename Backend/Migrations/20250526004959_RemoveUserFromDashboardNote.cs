using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserFromDashboardNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DashboardNote_Users_UserId",
                table: "DashboardNote");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelBudgets_Trips_TripId",
                table: "TravelBudgets");

            migrationBuilder.DropIndex(
                name: "IX_TravelBudgets_TripId",
                table: "TravelBudgets");

            migrationBuilder.DropIndex(
                name: "IX_DashboardNote_UserId",
                table: "DashboardNote");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DashboardNote");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "DashboardNote",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TravelBudgets_TripId",
                table: "TravelBudgets",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_DashboardNote_UserId",
                table: "DashboardNote",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardNote_Users_UserId",
                table: "DashboardNote",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TravelBudgets_Trips_TripId",
                table: "TravelBudgets",
                column: "TripId",
                principalTable: "Trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
