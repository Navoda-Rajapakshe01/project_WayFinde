using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class AddDashboardNoteTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "NoteDescription",
                table: "DashboardNotes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "CreatedTime",
                table: "DashboardNotes",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time",
                oldDefaultValueSql: "CONVERT(time, GETDATE())");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "DashboardNotes",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "DashboardNotes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.CreateIndex(
                name: "IX_DashboardNotes_UserId",
                table: "DashboardNotes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DashboardNotes_UsersNew_UserId",
                table: "DashboardNotes",
                column: "UserId",
                principalTable: "UsersNew",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DashboardNotes_UsersNew_UserId",
                table: "DashboardNotes");

            migrationBuilder.DropIndex(
                name: "IX_DashboardNotes_UserId",
                table: "DashboardNotes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DashboardNotes");

            migrationBuilder.AlterColumn<string>(
                name: "NoteDescription",
                table: "DashboardNotes",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "CreatedTime",
                table: "DashboardNotes",
                type: "time",
                nullable: false,
                defaultValueSql: "CONVERT(time, GETDATE())",
                oldClrType: typeof(TimeSpan),
                oldType: "time");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "DashboardNotes",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");
        }
    }
}
