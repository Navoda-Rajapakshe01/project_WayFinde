using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;

var builder = WebApplication.CreateBuilder(args);


// Register HttpClient and WeatherService
builder.Services.AddHttpClient<IWeatherService, WeatherService>();


// Add AppDbContext with correct connection string
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("CloudConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    )
);




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
    "diccvuqqo",
    "269366281956762",
    "80wa84I1eT5EwO6CW3RIAtW56rc"
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
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5174", "https://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
    );

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

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowReactApp");

// Enable HTTPS
app.UseHttpsRedirection();

// Enable Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Backend.Hubs.NotificationHub>("/notificationHub");

app.Run();
