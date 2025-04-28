using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RenameVehicleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Ownerity",
                table: "Vehicles",
                newName: "OwnerCity");

            migrationBuilder.RenameColumn(
                name: "NumberOfPassangers",
                table: "Vehicles",
                newName: "NumberOfPassengers");

            migrationBuilder.RenameColumn(
                name: "Loation",
                table: "Vehicles",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "Disription",
                table: "Vehicles",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OwnerCity",
                table: "Vehicles",
                newName: "Ownerity");

            migrationBuilder.RenameColumn(
                name: "NumberOfPassengers",
                table: "Vehicles",
                newName: "NumberOfPassangers");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Vehicles",
                newName: "Loation");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Vehicles",
                newName: "Disription");
        }
    }
}
