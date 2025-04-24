using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ SQL Server DB එකට Connect වෙන AppDbContext එක add කරනවා
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Controller-based API එකක් enable කිරීම
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Swagger UI (testing tool) enable කිරීම development mode එකට
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ HTTPS redirect & authorization middleware
app.UseHttpsRedirection();
app.UseAuthorization();

// ✅ Controller routes map කරන එක (MEHEMA නැත්නම් route එක වැඩ නොකරයි!)
app.MapControllers();

app.Run();
