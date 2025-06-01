using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserNewTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogImagesNew_Blogs_BlogId",
                table: "BlogImagesNew");

            migrationBuilder.AlterColumn<int>(
                name: "BlogId",
                table: "BlogImagesNew",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_BlogImagesNew_Blogs_BlogId",
                table: "BlogImagesNew",
                column: "BlogId",
                principalTable: "Blogs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogImagesNew_Blogs_BlogId",
                table: "BlogImagesNew");

            migrationBuilder.AlterColumn<int>(
                name: "BlogId",
                table: "BlogImagesNew",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BlogImagesNew_Blogs_BlogId",
                table: "BlogImagesNew",
                column: "BlogId",
                principalTable: "Blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
