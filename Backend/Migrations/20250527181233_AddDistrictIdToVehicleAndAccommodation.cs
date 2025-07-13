using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDistrictIdToVehicleAndAccommodation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Vehicles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Accommodations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_DistrictId",
                table: "Vehicles",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_Accommodations_DistrictId",
                table: "Accommodations",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Accommodations_Districts_DistrictId",
                table: "Accommodations",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Districts_DistrictId",
                table: "Vehicles",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accommodations_Districts_DistrictId",
                table: "Accommodations");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Districts_DistrictId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_DistrictId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Accommodations_DistrictId",
                table: "Accommodations");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Accommodations");
        }
    }
}
