using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;

var builder = WebApplication.CreateBuilder(args);

// Add AppDbContext with NavodaConnection (only one context to avoid duplication)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CloudConnection")));

//builder.Services.AddDbContext<UserDbContext>(options =>
 //   options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Authentication with JWT Bearer
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
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["AppSettings:Token"] 
                    ?? throw new InvalidOperationException("JWT Token key is missing in configuration (AppSettings:Token).")
                )
            ),
            ValidateIssuerSigningKey = true,
        };
    });

// Cloudinary Configuration
builder.Services.AddSingleton(new Cloudinary(new Account(
    "dhbge2nsx",
    "488872561461659",
    "K5-bbTL--bc9OqYDM9Jz54KU9_w"
)));

// Register project services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<BlobService>();

builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddScoped<VehicleReservationService>();


// Add CORS policies
builder.Services.AddCors(options =>
{
    // Development policy for local React apps
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5174", "https://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
    );

    // Production policy (customize as needed)
    options.AddPolicy("ProductionCorsPolicy", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

// Add Controllers with JSON options
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.MaxDepth = 32;
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add SignalR and HTTP Context
builder.Services.AddSignalR();
builder.Services.AddHttpContextAccessor();

// Build the app
var app = builder.Build();

// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("ProductionCorsPolicy");
}

// Enable CORS before auth
// Apply CORS policy BEFORE Authentication middleware
app.UseCors("AllowReactApp");

// Use HTTPS redirection
app.UseHttpsRedirection();
// Enable Authentication and Authorization middlewares
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Backend.Hubs.NotificationHub>("/notificationHub");

app.Run();
