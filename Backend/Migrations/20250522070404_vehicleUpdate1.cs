using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class vehicleUpdate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "OwnerCity",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "OwnerName",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "BillingName",
                table: "VehicleReservations");

            migrationBuilder.DropColumn(
                name: "City",
                table: "VehicleReservations");

            migrationBuilder.DropColumn(
                name: "DriversLicenseNumber",
                table: "VehicleReservations");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "VehicleReservations");

            migrationBuilder.RenameColumn(
                name: "DatePosted",
                table: "VehicleReviews",
                newName: "ReviewDate");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "VehicleReservations",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "StreetAddress",
                table: "VehicleReservations",
                newName: "ReturnLocation");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "VehicleReservations",
                newName: "PickupLocation");

            migrationBuilder.RenameColumn(
                name: "ReservationDate",
                table: "VehicleReservations",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "VehicleReservations",
                newName: "CustomerName");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "VehicleReservations",
                newName: "AdditionalRequirements");

            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "VehicleReviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BookingDate",
                table: "VehicleReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "VehicleReservations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "VehicleReservations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "VehicleAmenities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    AmenityName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleAmenities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleAmenities_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VehicleAmenities_VehicleId",
                table: "VehicleAmenities",
                column: "VehicleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VehicleAmenities");

            migrationBuilder.DropColumn(
                name: "BookingDate",
                table: "VehicleReservations");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "VehicleReservations");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "VehicleReservations");

            migrationBuilder.RenameColumn(
                name: "ReviewDate",
                table: "VehicleReviews",
                newName: "DatePosted");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "VehicleReservations",
                newName: "ZipCode");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "VehicleReservations",
                newName: "ReservationDate");

            migrationBuilder.RenameColumn(
                name: "ReturnLocation",
                table: "VehicleReservations",
                newName: "StreetAddress");

            migrationBuilder.RenameColumn(
                name: "PickupLocation",
                table: "VehicleReservations",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "CustomerName",
                table: "VehicleReservations",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "AdditionalRequirements",
                table: "VehicleReservations",
                newName: "FullName");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerCity",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OwnerName",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Comment",
                table: "VehicleReviews",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "BillingName",
                table: "VehicleReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "VehicleReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DriversLicenseNumber",
                table: "VehicleReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "VehicleReservations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Description", "OwnerCity", "OwnerName" },
                values: new object[] { "A comfortable and fuel-efficient city car.", "Colombo", "John Doe" });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Description", "OwnerCity", "OwnerName" },
                values: new object[] { "Perfect for short family trips and hill country.", "Kandy", "Jane Smith" });
        }
    }
}
