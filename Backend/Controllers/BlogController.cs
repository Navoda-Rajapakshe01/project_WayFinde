
﻿using Azure.Storage.Blobs;
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
        [Authorize] // Add the Authorize attribute to ensure the user is authenticated
        public async Task<IActionResult> UploadBlog([FromForm] UploadBlogDto uploadDto)
        {
            try
            {
                if (uploadDto.Document == null || uploadDto.Image == null)
                    return BadRequest("Document and image are required.");

                // Upload document
                var docUploadParams = new RawUploadParams
                {
                    File = new FileDescription(uploadDto.Document.FileName, uploadDto.Document.OpenReadStream()),
                    Folder = "blog_documents"
                };
                var docResult = await _cloudinary.UploadAsync(docUploadParams);
                if (docResult.StatusCode != HttpStatusCode.OK)
                    return StatusCode(500, "Document upload failed.");

                // Upload image
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("save-blogs")]
        [Authorize]
        public async Task<IActionResult> SaveBlog([FromForm] IFormFile file, [FromForm] string title, [FromForm] string coverImageUrl)
        {
            try
            {
                // Input validation
                if (file == null || file.Length == 0)
                    return BadRequest("No blog file uploaded.");

                if (string.IsNullOrWhiteSpace(title))
                    return BadRequest("Blog title is required.");

                // Get UserId from JWT token
                var userIdClaim = User.FindFirst("sub") ?? User.FindFirst("id") ?? User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                {
                    return BadRequest("Invalid user authentication. Please log in again.");
                }

                // Validate Azure Blob Storage configuration
                var connectionString = _config["AzureBlobStorage:ConnectionString"];
                var containerName = _config["AzureBlobStorage:ContainerName"];

                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    return StatusCode(500, "Azure Blob Storage connection string is not configured.");
                }

                if (string.IsNullOrWhiteSpace(containerName))
                {
                    return StatusCode(500, "Azure Blob Storage container name is not configured.");
                }

                // Upload to Azure Blob Storage
                var container = new BlobContainerClient(connectionString, containerName);
                await container.CreateIfNotExistsAsync();

                // Generate unique filename to avoid conflicts
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var blobClient = container.GetBlobClient(fileName);

                using var stream = file.OpenReadStream();
                await blobClient.UploadAsync(stream, overwrite: true);
                var blobUrl = blobClient.Uri.ToString();

                // Get author name from claims
                var author = User.FindFirst("name")?.Value ??
                            User.FindFirst("username")?.Value ??
                            User.FindFirst(ClaimTypes.Name)?.Value ??
                            (User.Identity != null ? User.Identity.Name : null) ??
                            "Unknown Author";

                // Save blog metadata to DB
                var blog = new Blog
                {
                    Title = title.Trim(),
                    BlogUrl = blobUrl,
                    Author = author,
                    UserId = userId, // This was missing!
                    CreatedAt = DateTime.UtcNow,
                    Location = string.Empty,
                    Tags = new List<string>(),
                    NumberOfComments = 0,
                    NumberOfReads = 0,
                    NumberOfReacts = 0,
                    CoverImageUrl = coverImageUrl ?? string.Empty,
                    ImageUrls = new List<string>()
                };

                _dbContext.Blogs.Add(blog);
                await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    message = "Blog saved successfully",
                    blogUrl = blobUrl,
                    blogId = blog.Id
                });
            }
            catch (DbUpdateException dbEx)
            {
                // Log the inner exception for more details
                var innerException = dbEx.InnerException?.Message ?? dbEx.Message;
                return StatusCode(500, $"Database Error: {innerException}");
            }
            catch (Azure.RequestFailedException azureEx)
            {
                return StatusCode(500, $"Azure Storage Error: {azureEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the full exception details
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("upload-cover-image")]
        [Authorize]
        public async Task<IActionResult> UploadCoverImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest(new { message = "No file provided." });

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageFile.FileName, imageFile.OpenReadStream()),
                Folder = "blog_covers"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return Ok(new { imageUrl = uploadResult.SecureUrl.ToString() });
            }

            return StatusCode(500, new { message = "Cloudinary upload failed" });
        }

        //Display blogs with the unique id
        [HttpGet("{Id}")]
        public async Task<ActionResult<Blog>> GetBlog(int Id)
        {
            try
            {
                var blogs = await _context.Blogs.ToListAsync();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger?.LogError(ex, "Error fetching blogs.");
                return StatusCode(500, new { message = "internal server error" });
            }
        }
        // GET: api/Blog/display/{id}
        [HttpGet("display/{id}")]
        public async Task<ActionResult<Blog>> GetBlogById(int id)
        {
            // Validate the ID
            if (id <= 0)
            {
                return BadRequest("Invalid blog ID");
            }

            try
            {
                var blog = await _context.Blogs
                    .Include(b => b.User)  // Include the related User data
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (blog == null)
                {
                    return NotFound($"Blog with ID {id} not found");
                }

                return Ok(blog);
            }
            catch (Exception)
            {
                // Log the exception here if you have logging configured
                return StatusCode(500, "An error occurred while retrieving the blog");
            }
        }


        //Add a new comment to the blog
        [HttpPost("newComment")]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            var blog = await _context.Blogs.FindAsync(dto.BlogId);
            if (blog == null)
                return NotFound("Blog not found");

            var user = await _context.UsersNew.FindAsync(dto.UserId);
            if (user == null)
                return NotFound("User not found");

            var comment = new Comment
            {
                Blog = blog,
                User = user,
                UserId = dto.UserId,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            // Increment comment count
            blog.NumberOfComments++;

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                comment,
                blogCommentCount = blog.NumberOfComments  // Return updated count
            });
        }



        // GET: api/blog/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllBlogs()
        {
            try
            {
                var blogs = await _context.Blogs
                    .Include(b => b.User) // Include user data
                    .ToListAsync();

                // Create a simplified object without circular references
                var simplifiedBlogs = blogs.Select(b => new {
                    Id = b.Id,
                    Title = b.Title ?? string.Empty,
                    BlogUrl = b.BlogUrl ?? string.Empty,
                    CreatedAt = b.CreatedAt,
                    Location = b.Location ?? string.Empty,
                    Tags = b.Tags ?? new List<string>(), // Prevent null reference
                    NumberOfComments = b.NumberOfComments,
                    NumberOfReads = b.NumberOfReads,
                    NumberOfReacts = b.NumberOfReacts,
                    Author = b.Author ?? string.Empty,
                    CoverImageUrl = b.CoverImageUrl ?? string.Empty,
                    ImageUrls = b.ImageUrls ?? new List<string>(),
                    //Description = b.Description ?? string.Empty,
                    User = b.User == null ? new { Id = Guid.Empty, Username = "Unknown", ProfilePictureUrl = (string?)null, Bio = (string?)null } : new
                    {
                        Id = b.User.Id,
                        Username = b.User.Username ?? string.Empty,
                        ProfilePictureUrl = b.User.ProfilePictureUrl,
                        Bio = b.User.Bio
                    }
                }).ToList();

                return Ok(simplifiedBlogs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllBlogs: {Message}", ex.Message);
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }


        //Delete a blog in the profile
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound(new { message = "Blog not found." });
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog deleted successfully." });
        }

        [HttpGet("proxy-blog-content")]
        public async Task<IActionResult> ProxyBlogContent([FromQuery] string url)
        {
            if (string.IsNullOrEmpty(url))
                return BadRequest("URL is required");

            try
            {
                // Validate URL format
                if (!Uri.TryCreate(url, UriKind.Absolute, out var validatedUri))
                {
                    return BadRequest("Invalid URL format");
                }

                using var httpClient = new HttpClient();

                // Set a reasonable timeout
                httpClient.Timeout = TimeSpan.FromSeconds(30);

                // Add user agent header to avoid blocking
                httpClient.DefaultRequestHeaders.Add("User-Agent", "BlogProxyService/1.0");

                // Log the URL being requested for debugging
                Console.WriteLine($"Fetching content from: {url}");

                var response = await httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"HTTP Error: {response.StatusCode} - {response.ReasonPhrase}");
                    return StatusCode((int)response.StatusCode, $"Error fetching content: {response.ReasonPhrase}");
                }

                var content = await response.Content.ReadAsStringAsync();

                if (string.IsNullOrEmpty(content))
                {
                    return NotFound("Content is empty");
                }

                // Set appropriate content type
                return Content(content, "text/html; charset=utf-8");
            }
            catch (HttpRequestException httpEx)
            {
                Console.WriteLine($"HTTP Request Error: {httpEx.Message}");
                return StatusCode(500, $"Network error: {httpEx.Message}");
            }
            catch (TaskCanceledException tcEx)
            {
                Console.WriteLine($"Timeout Error: {tcEx.Message}");
                return StatusCode(408, "Request timeout");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error in ProxyBlogContent: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, $"Error fetching content: {ex.Message}");
            }
        }
        // GET: api/Blog/{blogId}/comments
        [HttpGet("{blogId}/comments")]
        public async Task<ActionResult<IEnumerable<object>>> GetBlogComments(int blogId)
        {
            // Validate the blog ID
            if (blogId <= 0)
            {
                return BadRequest("Invalid blog ID");
            }

            try
            {
                // Check if the blog exists
                var blogExists = await _context.Blogs.AnyAsync(b => b.Id == blogId);
                if (!blogExists)
                {
                    return NotFound($"Blog with ID {blogId} not found");
                }

                // Get all comments for the specified blog, ordered by creation date
                var comments = await _context.Comments
                    .Where(c => c.Blog.Id == blogId)
                    .Include(c => c.User)
                    .OrderByDescending(c => c.CreatedAt)
                    .ToListAsync();

                // Create simplified objects without circular references
                var simplifiedComments = comments.Select(c => new {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    User = new
                    {
                        Id = c.User.Id,
                        Username = c.User.Username,
                        ProfilePictureUrl = c.User.ProfilePictureUrl ?? string.Empty,
                        Bio = c.User.Bio ?? string.Empty
                    }
                });

                return Ok(simplifiedComments);
            }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving comments for blog {blogId}");
            return StatusCode(500, "An error occurred while retrieving comments");
        }
    }

    // Controllers/BlogController.cs

    // GET: api/Blog/{blogId}/reactions/count
    [HttpGet("{blogId}/reactions/count")]
    public async Task<ActionResult<int>> GetBlogReactionsCount(int blogId)
    {
        var count = await _context.BlogReactions
            .Where(r => r.BlogId == blogId)
            .CountAsync();

        return Ok(count);
    }

        // GET: api/Blog/{blogId}/reactions/status
        [HttpGet("{blogId}/reactions/status")]
        [Authorize]
        public async Task<ActionResult<bool>> GetUserReactionStatus(int blogId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID format");

            bool hasReacted = await _context.BlogReactions
                .AnyAsync(r => r.BlogId == blogId && r.UserId == userId);

            return Ok(hasReacted);
        }

        // POST: api/Blog/{blogId}/react
        [HttpPost("{blogId}/react")]
        [Authorize]
        public async Task<IActionResult> ReactToBlog(int blogId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            if (!Guid.TryParse(userIdClaim.Value, out Guid userId))
                return BadRequest("Invalid user ID format");

            // Find the blog
            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null)
                return NotFound("Blog not found");

            // Check if already reacted
            var existingReaction = await _context.BlogReactions
                .FirstOrDefaultAsync(r => r.BlogId == blogId && r.UserId == userId);

            if (existingReaction != null)
            {
                // Remove reaction (toggle)
                _context.BlogReactions.Remove(existingReaction);

                // Decrease reaction count on the blog itself
                blog.NumberOfReacts = Math.Max(0, blog.NumberOfReacts - 1);
                await _context.SaveChangesAsync();

                return Ok(new { reacted = false, count = blog.NumberOfReacts });
            }

            // Add new reaction
            _context.BlogReactions.Add(new BlogReaction
            {
                BlogId = blogId,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });

            // Increase reaction count on the blog
            blog.NumberOfReacts++;
            await _context.SaveChangesAsync();

            return Ok(new { reacted = true, count = blog.NumberOfReacts });
        }

        [HttpGet("blogDescription")]
        private async Task<string> GetFirst100WordsFromBlobAsync(string blobUrl)
        {
            try
            {
                // Parse the blob URL to get container and blob name
                var uri = new Uri(blobUrl);
                var blobClient = new BlobClient(uri);

                // Download the blob content as text
                var downloadInfo = await blobClient.DownloadAsync();
                using var reader = new StreamReader(downloadInfo.Value.Content, Encoding.UTF8);
                var content = await reader.ReadToEndAsync();

                // Extract first 100 words
                var words = content.Split(new[] { ' ', '\r', '\n', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                return string.Join(" ", words.Take(100));
            }
            catch
            {
                return "No description available";
            }

        }



    }
} 