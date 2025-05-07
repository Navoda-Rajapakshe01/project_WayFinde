using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class AddUrlImagesToUsersNewUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlImages",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlImages",
                table: "UsersNew");
        }
    }
}
