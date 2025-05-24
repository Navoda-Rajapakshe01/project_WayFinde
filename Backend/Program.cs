using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ➕ Add AppDbContext and connect to SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register UserDbContext for dependency injection
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register VehicleReservationService
builder.Services.AddScoped<VehicleReservationService>();

// ➕ Add Authentication with JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"])),
            ValidateIssuerSigningKey = true,
        };
    });

// ➕ Add services to container
builder.Services.AddScoped<IAuthService, AuthService>();

// ➕ Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173") // Allow the frontend React app to communicate with the backend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ➕ Add Controllers
builder.Services.AddControllers();

// ➕ Swagger for API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ➡️ Build the App
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy BEFORE auth
app.UseCors("AllowReactApp"); // Ensure this line is before UseAuthentication

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Enable Authentication and Authorization middleware
app.UseAuthentication();

// ➡️ Apply CORS policy
app.UseCors("AllowReactApp");

// ➡️ Authorization Middleware
app.UseAuthorization();

// ➡️ Map Controllers
app.MapControllers();

// Start the app
app.Run();
