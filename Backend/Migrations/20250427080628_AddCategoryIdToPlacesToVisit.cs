using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryIdToPlacesToVisit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "PlacesToVisit",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlacesToVisit_CategoryId",
                table: "PlacesToVisit",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlacesToVisit_Categories_CategoryId",
                table: "PlacesToVisit",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlacesToVisit_Categories_CategoryId",
                table: "PlacesToVisit");

            migrationBuilder.DropIndex(
                name: "IX_PlacesToVisit_CategoryId",
                table: "PlacesToVisit");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "PlacesToVisit");
        }
    }
}
