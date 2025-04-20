using Backend.Data;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ➕ Add AppDbContext and connect to SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SachinthaConnection")));

// ? Register CORS policy here
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .WithOrigins("http://localhost:5173") // Adjust to your front-end address
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Middleware
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    //app.MapOpenApi();
   
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// ✅ Apply the CORS middleware here
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Sample endpoint (you can delete later)
//app.MapGet("/weatherforecast", () =>
//{
//    var summaries = new[]
//    {
//        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
//    };

    //var forecast = Enumerable.Range(1, 5).Select(index =>
    //    new WeatherForecast
    //    (
    //        DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
    //        Random.Shared.Next(-20, 55),
    //        summaries[Random.Shared.Next(summaries.Length)]
    //    ))
    //    .ToArray();
    //return forecast;
//})
//.WithName("GetWeatherForecast")
//.WithOpenApi();

app.MapControllers();

app.Run();

// Define WeatherForecast record
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
