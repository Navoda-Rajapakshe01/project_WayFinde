using Backend.Data;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register UserDbContext for dependency injection
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"])),
            ValidateIssuerSigningKey = true,
        };
    });

//Cloudinary
builder.Services.AddSingleton(new Cloudinary(new Account(
    "diccvuqqo",
    "269366281956762",
    "80wa84I1eT5EwO6CW3RIAtW56rc"
)));

// Add services to container
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<VehicleReservationService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5174",
            "https://localhost:5175") // Allow the frontend React app to communicate with the backend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Add Controllers
builder.Services.AddControllers();

// Swagger for API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build the App
var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // For production, you might want a more restrictive CORS policy
    // or comment this out if you don't need CORS in production
    app.UseCors("ProductionCorsPolicy"); // Define this policy in the services section if needed
}
// Apply CORS policy BEFORE auth
app.UseCors("AllowReactApp"); // Ensure this line is before UseAuthentication

// Enable HTTPS redirection
app.UseHttpsRedirection();

// Enable Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Start the app
app.Run();
