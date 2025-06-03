using Backend.Data;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using CloudinaryDotNet;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//Database context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SachinthaConnection")));




// Authentication with JWT Bearer
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




//services to container
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<BlobService>();


//CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174",
            "http://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials() 
    );
});


//Controllers
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    x.JsonSerializerOptions.WriteIndented = true;
});

// Add Controllers
builder.Services.AddControllers();
// Add SignalR
builder.Services.AddSignalR();



// Swagger for API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
   
    app.UseCors("ProductionCorsPolicy"); 
}


// Apply CORS policy BEFORE auth
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// Map SignalR hubs
app.MapHub<Backend.Hubs.NotificationHub>("/notificationHub");

app.Run();
