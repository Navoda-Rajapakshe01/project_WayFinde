using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePostTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Districts_DistrictId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_DistrictId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Posts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_DistrictId",
                table: "Posts",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Districts_DistrictId",
                table: "Posts",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
