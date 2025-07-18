using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;
using Backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add AppDbContext with NavodaConnection (only one context to avoid duplication)
//builder.Services.AddDbContext<AppDbContext>(options =>
  //  options.UseSqlServer(builder.Configuration.GetConnectionString("NavodaConnection")));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CloudConnection")));

// Add Authentication with JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["AppSettings:Token"] 
                    ?? throw new InvalidOperationException("JWT Token key is missing in configuration (AppSettings:Token).")
                )
            ),
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Cloudinary Configuration
builder.Services.AddSingleton(new Cloudinary(new Account(
    "diccvuqqo",
    "269366281956762",
    "80wa84I1eT5EwO6CW3RIAtW56rc"
)));

// Register project services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<BlobService>();
builder.Services.AddTransient<IEmailService, EmailService>();


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
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
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

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp"); // or your relevant policy

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
