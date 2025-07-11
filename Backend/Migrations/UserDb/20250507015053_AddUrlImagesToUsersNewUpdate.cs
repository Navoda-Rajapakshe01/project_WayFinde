using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations.UserDb
{
<<<<<<<< HEAD:Backend/Migrations/UserDb/20250507015053_AddUrlImagesToUsersNewUpdate.cs
    /// <inheritdoc />
    public partial class AddUrlImagesToUsersNewUpdate : Migration
========
    public partial class AddGoogleMapLinkColumn : Migration
>>>>>>>> fd78f30c20209d4cc39a872b79bfe7ba947847ce:Backend/Migrations/20250426054104_AddGoogleMapLinkColumn.cs
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
<<<<<<<< HEAD:Backend/Migrations/UserDb/20250507015053_AddUrlImagesToUsersNewUpdate.cs
                name: "UrlImages",
                table: "UsersNew",
========
                name: "GoogleMapLink",
                table: "PlacesToVisit",
>>>>>>>> fd78f30c20209d4cc39a872b79bfe7ba947847ce:Backend/Migrations/20250426054104_AddGoogleMapLinkColumn.cs
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
<<<<<<<< HEAD:Backend/Migrations/UserDb/20250507015053_AddUrlImagesToUsersNewUpdate.cs
                name: "UrlImages",
                table: "UsersNew");
========
                name: "GoogleMapLink",
                table: "PlacesToVisit");
>>>>>>>> fd78f30c20209d4cc39a872b79bfe7ba947847ce:Backend/Migrations/20250426054104_AddGoogleMapLinkColumn.cs
        }
    }
}
