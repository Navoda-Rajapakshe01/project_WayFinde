using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionToBlogTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_Districts_DistrictId",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_DistrictId",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Blogs");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Blogs");

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_DistrictId",
                table: "Blogs",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_Districts_DistrictId",
                table: "Blogs",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
