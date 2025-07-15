using Azure.Storage.Blobs;
using Backend.Data;
using Backend.DTO;
using Backend.DTOs;
using Backend.Models;
using Backend.Models.User;
using Backend.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly BlobService _blobService;
        private readonly Cloudinary _cloudinary;
        private readonly AppDbContext _context;
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<BlogController> _logger;

        public BlogController(
             Cloudinary cloudinary,
             AppDbContext context,
             IAuthService authService,
             IUserService userService,
             BlobService blobService,
             IHttpContextAccessor httpContextAccessor,
             ILogger<BlogController> logger,
             AppDbContext dbContext,
             IConfiguration config)
        {
            _cloudinary = cloudinary;
            _context = context;
            _authService = authService;
            _userService = userService;
            _logger = logger;
            _blobService = blobService;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            _config = config;
        }

        [HttpPost("upload-blogs")]
        [Authorize]
        public async Task<IActionResult> UploadBlog([FromForm] UploadBlogDto uploadDto)
        {
            if (uploadDto.Document == null || uploadDto.Image == null)
                return BadRequest("Document and image are required.");

            var docUploadParams = new RawUploadParams
            {
                File = new FileDescription(uploadDto.Document.FileName, uploadDto.Document.OpenReadStream()),
                Folder = "blog_documents"
            };
            var docResult = await _cloudinary.UploadAsync(docUploadParams);
            if (docResult.StatusCode != HttpStatusCode.OK)
                return StatusCode(500, "Document upload failed.");

            var imageUploadParams = new ImageUploadParams
            {
                File = new FileDescription(uploadDto.Image.FileName, uploadDto.Image.OpenReadStream()),
                Folder = "blog_images"
            };
            var imageResult = await _cloudinary.UploadAsync(imageUploadParams);
            if (imageResult.StatusCode != HttpStatusCode.OK)
                return StatusCode(500, "Image upload failed.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return Unauthorized("Invalid or missing user ID.");

            var blog = new Blog
            {
                Title = uploadDto.Title,
                Author = uploadDto.Author,
                Location = uploadDto.Location,
                BlogUrl = docResult.SecureUrl.ToString(),
                CoverImageUrl = imageResult.SecureUrl.ToString(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Blog uploaded successfully",
                blogUrl = blog.BlogUrl,
                imageUrl = blog.CoverImageUrl
            });
        }

        [HttpPost("save-blogs")]
        [Authorize]
        public async Task<IActionResult> SaveBlog([FromForm] IFormFile file, [FromForm] string title, [FromForm] string coverImageUrl)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No blog file uploaded.");
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Blog title is required.");

            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user authentication. Please log in again.");

            string description = "";
            using (var streamReader = new StreamReader(file.OpenReadStream()))
            {
                var content = await streamReader.ReadToEndAsync();
                var words = content.Split(new[] { ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                description = string.Join(" ", words.Take(100));
                if (words.Length > 100)
                    description += "...";
            }

            var connectionString = _config["AzureBlobStorage:ConnectionString"];
            var containerName = _config["AzureBlobStorage:ContainerName"];
            if (string.IsNullOrWhiteSpace(connectionString) || string.IsNullOrWhiteSpace(containerName))
                return StatusCode(500, "Azure Blob Storage settings are not properly configured.");

            var container = new BlobContainerClient(connectionString, containerName);
            await container.CreateIfNotExistsAsync();

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var blobClient = container.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();
            stream.Position = 0;
            await blobClient.UploadAsync(stream, overwrite: true);
            var blobUrl = blobClient.Uri.ToString();

            var author = User.FindFirst("name")?.Value ??
                         User.FindFirst("username")?.Value ??
                         User.FindFirst(ClaimTypes.Name)?.Value ??
                         User.Identity?.Name ??
                         "Unknown Author";

            var blog = new Blog
            {
                Title = title.Trim(),
                BlogUrl = blobUrl,
                Author = author,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Location = string.Empty,
                Tags = new List<string>(),
                NumberOfComments = 0,
                NumberOfReads = 0,
                NumberOfReacts = 0,
                CoverImageUrl = coverImageUrl ?? string.Empty,
                ImageUrls = new List<string>(),
                Description = description
            };

            _dbContext.Blogs.Add(blog);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Blog saved successfully", blogUrl = blobUrl, blogId = blog.Id });
        }

        [HttpGet("{blogId}/reactions/count")]
        public async Task<ActionResult<int>> GetBlogReactionsCount(int blogId)
        {
            var count = await _context.BlogReactions
                .Where(r => r.BlogId == blogId)
                .CountAsync();

            return Ok(count);
        }

        [HttpGet("{blogId}/reactions/status")]
        [Authorize]
        public async Task<ActionResult<bool>> GetUserReactionStatus(int blogId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return Unauthorized();

            var hasReacted = await _context.BlogReactions
                .AnyAsync(r => r.BlogId == blogId && r.UserId == userId);

            return Ok(hasReacted);
        }

        [HttpPost("{blogId}/react")]
        [Authorize]
        public async Task<IActionResult> ReactToBlog(int blogId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return Unauthorized();

            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null)
                return NotFound("Blog not found");

            var existingReaction = await _context.BlogReactions
                .FirstOrDefaultAsync(r => r.BlogId == blogId && r.UserId == userId);

            if (existingReaction != null)
            {
                _context.BlogReactions.Remove(existingReaction);
                blog.NumberOfReacts = Math.Max(0, blog.NumberOfReacts - 1);
                await _context.SaveChangesAsync();
                return Ok(new { reacted = false, count = blog.NumberOfReacts });
            }

            _context.BlogReactions.Add(new BlogReaction
            {
                BlogId = blogId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });

            blog.NumberOfReacts++;
            await _context.SaveChangesAsync();

            return Ok(new { reacted = true, count = blog.NumberOfReacts });
        }
    }
}
