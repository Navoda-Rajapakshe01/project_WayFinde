using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBlogReactionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_Districts_DistrictId",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_DistrictId",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "Blogs");

            migrationBuilder.CreateTable(
                name: "BlogReactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlogId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogReactions_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogReactions_UsersNew_UserId",
                        column: x => x.UserId,
                        principalTable: "UsersNew",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogReactions_BlogId_UserId",
                table: "BlogReactions",
                columns: new[] { "BlogId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlogReactions_UserId",
                table: "BlogReactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogReactions");

            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_DistrictId",
                table: "Blogs",
                column: "DistrictId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_Districts_DistrictId",
                table: "Blogs",
                column: "DistrictId",
                principalTable: "Districts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
