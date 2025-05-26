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

        public BlogController(
             Cloudinary cloudinary,
             AppDbContext context,
             IAuthService authService,
             IUserService userService,
             IHttpContextAccessor httpContextAccessor)
        {
            _cloudinary = cloudinary;
            _context = context;
            _authService = authService;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
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
        public async Task<IActionResult> CreateBlog([FromBody] Blog blog)
        {
            if (blog == null || string.IsNullOrWhiteSpace(blog.Title) || string.IsNullOrWhiteSpace(blog.BlogUrl))
            {
                return BadRequest("Invalid blog data.");
            }

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized("Invalid or missing user ID.");
            }

            blog.UserId = userId;
            blog.CreatedAt = DateTime.UtcNow;

            // Ensure tags list is not null
            blog.Tags ??= new List<string>();

            // Optional: Set fallback cover image if none provided
            if (string.IsNullOrEmpty(blog.CoverImageUrl))
            {
                blog.CoverImageUrl = "https://your-default-image-url.com/default.jpg";
            }

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog saved successfully", blog.Id });
        }


        [HttpPost("upload-image")]
        //[Authorize]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image file provided.");

            try
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(image.FileName, image.OpenReadStream()),
                    Folder = "quill_blog_images"
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode != HttpStatusCode.OK || string.IsNullOrEmpty(uploadResult.SecureUrl?.ToString()))
                {
                    return StatusCode(500, "Image upload to Cloudinary failed.");
                }

                return Ok(new
                {
                    imageUrl = uploadResult.SecureUrl.ToString(),
                    originalFilename = uploadResult.OriginalFilename
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // Make sure you have a GET endpoint for Swagger to detect
        [HttpGet]
        public async Task<IActionResult> GetBlogs()
        {
            try
            {
                var blogs = await _context.Blogs.ToListAsync();
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> PostBlog([FromBody] Blog post)
        {
            _context.Blogs.Add(post);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Blog saved" });
        }
    }
}