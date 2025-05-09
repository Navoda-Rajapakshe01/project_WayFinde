using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
    public partial class AddEmailToUserNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "UsersNew",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "UsersNew");
        }
    }
}
