using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSupplierIdFromAccommodation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accommodations_UserNew_SupplierId",
                table: "Accommodations");

            migrationBuilder.DropTable(
                name: "UserNew");

            migrationBuilder.DropIndex(
                name: "IX_Accommodations_SupplierId",
                table: "Accommodations");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "Accommodations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SupplierId",
                table: "Accommodations",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "UserNew",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastLoginDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfilePictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegisteredDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserNew", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accommodations_SupplierId",
                table: "Accommodations",
                column: "SupplierId");

            migrationBuilder.AddForeignKey(
                name: "FK_Accommodations_UserNew_SupplierId",
                table: "Accommodations",
                column: "SupplierId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
