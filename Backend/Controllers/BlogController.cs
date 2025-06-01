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
        // DELETE: api/blogs/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            // Add validation
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid blog ID" });
            }

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound(new { message = "Blog not found" });
            }

            // Optional: Check if the user owns this blog
            // var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // if (blog.UserId != userId) 
            // {
            //     return Forbid(new { message = "You can only delete your own blogs" });
            // }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Blog deleted successfully" });
        }
    }
}