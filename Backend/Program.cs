using Backend.Data;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ➕ Add AppDbContext and connect to SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("JithmiConnection")));

// ➕ Add UserDbContext and connect to SQL Server (for authentication)
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SachinthaConnection")));

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
        policy.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5174",
            "https://localhost:5175"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
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
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// ➡️ Authentication Middleware
app.UseAuthentication();

// ➡️ Apply CORS policy
app.UseCors("AllowReactApp");

// ➡️ Authorization Middleware
app.UseAuthorization();

// ➡️ Map Controllers
app.MapControllers();

// ➡️ Run the App
app.Run();
