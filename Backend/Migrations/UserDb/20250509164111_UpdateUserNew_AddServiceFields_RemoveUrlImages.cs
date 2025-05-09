using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class UpdateUserNew_AddServiceFields_RemoveUrlImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UrlImages",
                table: "UsersNew",
                newName: "ServiceType");

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastLoginDate",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RegisteredDate",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "LastLoginDate",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "RegisteredDate",
                table: "UsersNew");

            migrationBuilder.RenameColumn(
                name: "ServiceType",
                table: "UsersNew",
                newName: "UrlImages");
        }
    }
}
