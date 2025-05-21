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

        public BlogController(
             Cloudinary cloudinary,
             AppDbContext context,
             IAuthService authService,
             IUserService userService)
        {
            _cloudinary = cloudinary;
            _context = context;
            _authService = authService;
            _userService = userService;
        }

        [HttpGet("blogs/{id}")]
        public async Task<IActionResult> GetBlogById(string id)
        {
            var blog = await _userService.GetUserByIdAsync(id);
            if (blog == null)
            {
                return NotFound();
            }
            return Ok(blog);
        }
        [HttpPost("blogs")]
        public async Task<IActionResult> CreateBlog([FromBody] Blog blog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Save the blog to the database
            // ...
            return CreatedAtAction(nameof(GetBlogById), new { id = blog.Id }, blog);
        }

        [HttpPost("upload-blogs")]
        public async Task<IActionResult> UploadBlog([FromForm] IFormFile document, [FromForm] IFormFile image, [FromForm] string title, [FromForm] string author, [FromForm] string location)
        {
            if (document == null || image == null)
                return BadRequest("Document and image are required.");

            // Upload document
            var docUploadParams = new RawUploadParams
            {
                File = new FileDescription(document.FileName, document.OpenReadStream()),
                Folder = "blog_documents"
            };
            var docResult = await _cloudinary.UploadAsync(docUploadParams);
            if (docResult.StatusCode != HttpStatusCode.OK)
                return StatusCode(500, "Document upload failed.");

            // Upload image
            var imageUploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, image.OpenReadStream()),
                Folder = "blog_images"
            };
            var imageResult = await _cloudinary.UploadAsync(imageUploadParams);
            if (imageResult.StatusCode != HttpStatusCode.OK)
                return StatusCode(500, "Image upload failed.");

            // Get user ID
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
                return Unauthorized("Invalid or missing user ID.");

            // Create new blog record (adjust your Blog model accordingly)
            var blog = new Blog
            {
                Title = title,
                Author = author,
                Location = location,
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

    }
}
