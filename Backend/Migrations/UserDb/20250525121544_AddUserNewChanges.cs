using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class AddUserNewChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "UsersNew",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "UrlImages",
                table: "UsersNew",
                newName: "RegisteredDate");

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastLoginDate",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceType",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "LastLoginDate",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "ServiceType",
                table: "UsersNew");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "UsersNew",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "RegisteredDate",
                table: "UsersNew",
                newName: "UrlImages");
        }
    }
}
