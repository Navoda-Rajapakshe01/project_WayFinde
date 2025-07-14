using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccommodationReservations_UserNew_UserId",
                table: "AccommodationReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_UserNew_UserId",
                table: "Blogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_UserNew_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_DashboardNote_Trips_TripId1",
                table: "DashboardNote");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_UserNew_FollowedID",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_UserNew_FollowerID",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_UserNew_UserId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelBudgets_Trips_TripId1",
                table: "TravelBudgets");

            migrationBuilder.DropForeignKey(
                name: "FK_TripCollaborator_UserNew_UserId",
                table: "TripCollaborator");

            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Users_UserId",
                table: "Trips");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Trips_UserId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_TravelBudgets_TripId1",
                table: "TravelBudgets");

            migrationBuilder.DropIndex(
                name: "IX_DashboardNote_TripId1",
                table: "DashboardNote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserNew",
                table: "UserNew");

            migrationBuilder.DropColumn(
                name: "TripId1",
                table: "TravelBudgets");

            migrationBuilder.DropColumn(
                name: "TripId1",
                table: "DashboardNote");

            migrationBuilder.RenameTable(
                name: "UserNew",
                newName: "UsersNew");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "TripPlaces",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAccepted",
                table: "TripCollaborator",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UsersNew",
                table: "UsersNew",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TripDates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripId = table.Column<int>(type: "int", nullable: false),
                    PlaceId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripDates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripDates_PlacesToVisit_PlaceId",
                        column: x => x.PlaceId,
                        principalTable: "PlacesToVisit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripDates_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TripDates_PlaceId",
                table: "TripDates",
                column: "PlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_TripDates_TripId",
                table: "TripDates",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccommodationReservations_UsersNew_UserId",
                table: "AccommodationReservations",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_UsersNew_UserId",
                table: "Blogs",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_UsersNew_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_UsersNew_FollowedID",
                table: "Follows",
                column: "FollowedID",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_UsersNew_FollowerID",
                table: "Follows",
                column: "FollowerID",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_UsersNew_UserId",
                table: "Posts",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TripCollaborator_UsersNew_UserId",
                table: "TripCollaborator",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccommodationReservations_UsersNew_UserId",
                table: "AccommodationReservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_UsersNew_UserId",
                table: "Blogs");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_UsersNew_UserId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_UsersNew_FollowedID",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Follows_UsersNew_FollowerID",
                table: "Follows");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_UsersNew_UserId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_TripCollaborator_UsersNew_UserId",
                table: "TripCollaborator");

            migrationBuilder.DropTable(
                name: "TripDates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UsersNew",
                table: "UsersNew");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "TripPlaces");

            migrationBuilder.DropColumn(
                name: "IsAccepted",
                table: "TripCollaborator");

            migrationBuilder.RenameTable(
                name: "UsersNew",
                newName: "UserNew");

            migrationBuilder.AddColumn<int>(
                name: "TripId1",
                table: "TravelBudgets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TripId1",
                table: "DashboardNote",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserNew",
                table: "UserNew",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trips_UserId",
                table: "Trips",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TravelBudgets_TripId1",
                table: "TravelBudgets",
                column: "TripId1");

            migrationBuilder.CreateIndex(
                name: "IX_DashboardNote_TripId1",
                table: "DashboardNote",
                column: "TripId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AccommodationReservations_UserNew_UserId",
                table: "AccommodationReservations",
                column: "UserId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_UserNew_UserId",
                table: "Blogs",
                column: "UserId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_UserNew_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardNote_Trips_TripId1",
                table: "DashboardNote",
                column: "TripId1",
                principalTable: "Trips",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_UserNew_FollowedID",
                table: "Follows",
                column: "FollowedID",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Follows_UserNew_FollowerID",
                table: "Follows",
                column: "FollowerID",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_UserNew_UserId",
                table: "Posts",
                column: "UserId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelBudgets_Trips_TripId1",
                table: "TravelBudgets",
                column: "TripId1",
                principalTable: "Trips",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TripCollaborator_UserNew_UserId",
                table: "TripCollaborator",
                column: "UserId",
                principalTable: "UserNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Users_UserId",
                table: "Trips",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
