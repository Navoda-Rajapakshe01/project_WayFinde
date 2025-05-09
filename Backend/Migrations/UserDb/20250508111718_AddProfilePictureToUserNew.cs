using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class AddProfilePictureToUserNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "UsersNew");
        }
    }
}
