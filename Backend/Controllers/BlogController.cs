using Backend.Models;
using Backend.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Backend.DTO;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly Cloudinary _cloudinary;
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<BlogController> _logger;

        public BlogController(
             Cloudinary cloudinary,
             AppDbContext context,
             IAuthService authService,
             IUserService userService,
             IHttpContextAccessor httpContextAccessor,
             ILogger<BlogController> logger)
        {
            _cloudinary = cloudinary;
            _context = context;
            _authService = authService;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        //Upload blogs to the account
        [HttpPost("upload-blogs")]
        [Authorize] 
        public async Task<IActionResult> UploadBlog([FromForm] UploadBlogDto uploadDto)
        {
            try
            {
                if (uploadDto.Document == null || uploadDto.Image == null)
                    return BadRequest("Document and image are required.");

                //Upload document
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

        
        //Display blogs with the unique id
        [HttpGet("{Id}")]
        public async Task<ActionResult<Blog>> GetBlog(int Id)
        {
            try
            {
                var blog = await _context.Blogs
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == Id);

                if (blog == null)
                {
                    return NotFound(new { message = "Blog not found" });
                }

                //Ensure author is populated
                if (string.IsNullOrEmpty(blog.Author))
                {
                    blog.Author = blog.User?.Username ?? "Unknown Author";
                }

                return Ok(blog);
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger?.LogError(ex, "Error fetching blog with id {BlogId}", Id);
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
            catch (Exception ex)
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

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        // GET: api/blog/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetAllBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.User) // if you want to include user data
                .ToListAsync();

            return Ok(blogs);
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

    }
}