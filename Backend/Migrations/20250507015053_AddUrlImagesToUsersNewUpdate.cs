using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
    /// <inheritdoc />
<<<<<<<< HEAD:Backend/Migrations/20250521191610_AddTwoNewCoumnnsToBlogTable.cs
    public partial class AddTwoNewCoumnnsToBlogTable : Migration
========
    public partial class AddUrlImagesToUsersNewUpdate : Migration
>>>>>>>> vehicleNew:Backend/Migrations/20250507015053_AddUrlImagesToUsersNewUpdate.cs
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
<<<<<<<< HEAD:Backend/Migrations/20250521191610_AddTwoNewCoumnnsToBlogTable.cs
                name: "Author",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "Blogs",
========
                name: "UrlImages",
                table: "UsersNew",
>>>>>>>> vehicleNew:Backend/Migrations/20250507015053_AddUrlImagesToUsersNewUpdate.cs
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
<<<<<<<< HEAD:Backend/Migrations/20250521191610_AddTwoNewCoumnnsToBlogTable.cs
                name: "Author",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "Blogs");
========
                name: "UrlImages",
                table: "UsersNew");
>>>>>>>> vehicleNew:Backend/Migrations/20250507015053_AddUrlImagesToUsersNewUpdate.cs
        }
    }
}
