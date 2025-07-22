using Backend.Data;
using Backend.Models.Post;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<PostsController> _logger;

        public PostsController(
            AppDbContext context,
            IConfiguration configuration,
            ILogger<PostsController> logger,
            Cloudinary cloudinary)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _cloudinary = cloudinary;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid user credentials");
                }

                var posts = await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Images)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                var result = posts.Select(p => new PostDto
                {
                    Id = p.Id,
                    Caption = p.Content, // Map Content to Caption for frontend compatibility
                    CreatedAt = p.CreatedAt,
                    Likes = p.NumberOfReacts,
                    Comments = p.NumberOfComments,
                    Images = GetImageUrls(p), // Helper method to get all image URLs
                    Username = p.User?.Username ?? "Unknown",
                    ProfilePicture = p.User?.ProfilePictureUrl ?? "",
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting posts");
                return StatusCode(500, "An error occurred while retrieving posts");
            }
        }

        // POST: api/Posts
        // Replace your CreatePost method with this debug version
        [HttpPost]
        public async Task<ActionResult<PostDto>> CreatePost([FromForm] CreatePostRequest request)
        {
            try
            {
                _logger.LogInformation("=== POST CREATION DEBUG START ===");

                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user credentials");
                }

                _logger.LogInformation($"User ID: {userId}");
                _logger.LogInformation($"Caption: '{request.Caption}'");
                _logger.LogInformation($"Files count: {request.Files?.Count ?? 0}");

                // Step 1: Check if user exists
                var userExists = await _context.UsersNew.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return BadRequest($"User with ID {userId} not found in database");
                }
                _logger.LogInformation("✅ User exists in database");

                // Step 2: Upload images to Cloudinary first (but don't save to DB yet)
                var uploadedImageUrls = new List<string>();
                string coverImageUrl = string.Empty;

                if (request.Files != null && request.Files.Count > 0)
                {
                    _logger.LogInformation($"Processing {request.Files.Count} files...");

                    for (int i = 0; i < request.Files.Count; i++)
                    {
                        var file = request.Files[i];
                        if (file.Length > 0)
                        {
                            try
                            {
                                _logger.LogInformation($"Uploading file {i + 1}: {file.FileName}");

                                var uploadParams = new ImageUploadParams()
                                {
                                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                                    Folder = "posts",
                                    PublicId = $"post_{DateTime.UtcNow.Ticks}_{i}_{Guid.NewGuid()}",
                                    Transformation = new Transformation()
                                        .Quality("auto")
                                        .FetchFormat("auto")
                                };

                                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                                if (uploadResult.Error != null)
                                {
                                    _logger.LogError("Cloudinary upload error: {Error}", uploadResult.Error.Message);
                                    continue;
                                }

                                string imageUrl = uploadResult.SecureUrl.ToString();
                                uploadedImageUrls.Add(imageUrl);

                                if (i == 0)
                                {
                                    coverImageUrl = imageUrl;
                                }

                                _logger.LogInformation($"✅ Image {i + 1} uploaded: {imageUrl}");
                            }
                            catch (Exception imageEx)
                            {
                                _logger.LogError(imageEx, "❌ Error uploading image {FileName}", file.FileName);
                                return StatusCode(500, $"Failed to upload image: {imageEx.Message}");
                            }
                        }
                    }
                }

                _logger.LogInformation($"✅ Total images uploaded: {uploadedImageUrls.Count}");

                // Step 3: Create post object
                var post = new Post
                {
                    Title = string.IsNullOrEmpty(request.Caption) ? "Untitled" :
                           (request.Caption.Length > 50 ? request.Caption.Substring(0, 50) + "..." : request.Caption),
                    Content = request.Caption ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    Tags = string.Empty,
                    NumberOfComments = 0,
                    NumberOfReads = 0,
                    NumberOfReacts = 0,
                    CoverImageUrl = coverImageUrl,
                    ImageUrls = uploadedImageUrls.Any() ? System.Text.Json.JsonSerializer.Serialize(uploadedImageUrls) : string.Empty
                };

                _logger.LogInformation("Post object created with:");
                _logger.LogInformation($"  Title: {post.Title}");
                _logger.LogInformation($"  Content: {post.Content}");
                _logger.LogInformation($"  UserId: {post.UserId}");
                _logger.LogInformation($"  CoverImageUrl: {post.CoverImageUrl}");
                _logger.LogInformation($"  ImageUrls: {post.ImageUrls}");

                // Step 4: Save ONLY the post first (no PostImages yet)
                _logger.LogInformation("Adding post to context...");
                _context.Posts.Add(post);

                _logger.LogInformation("Saving post to database...");
                await _context.SaveChangesAsync();

                _logger.LogInformation($"✅ Post saved successfully with ID: {post.Id}");

                // Step 5: Try to create PostImage records (this might be where it fails)
                if (uploadedImageUrls.Any())
                {
                    _logger.LogInformation($"Creating {uploadedImageUrls.Count} PostImage records...");

                    try
                    {
                        for (int i = 0; i < uploadedImageUrls.Count; i++)
                        {
                            var postImage = new PostImage
                            {
                                PostId = post.Id,
                                ImageUrl = uploadedImageUrls[i],
                                DisplayOrder = i
                            };

                            _logger.LogInformation($"Adding PostImage {i + 1}: PostId={post.Id}, ImageUrl={uploadedImageUrls[i]}, DisplayOrder={i}");
                            _context.PostImages.Add(postImage);
                        }

                        _logger.LogInformation("Saving PostImage records...");
                        await _context.SaveChangesAsync();
                        _logger.LogInformation("✅ PostImage records saved successfully");
                    }
                    catch (Exception postImageEx)
                    {
                        _logger.LogError(postImageEx, "❌ Error saving PostImage records");
                        _logger.LogError("PostImage error details: {Message}", postImageEx.Message);
                        if (postImageEx.InnerException != null)
                        {
                            _logger.LogError("PostImage inner exception: {InnerMessage}", postImageEx.InnerException.Message);
                        }

                        // Post is already saved, so we can continue without PostImage records
                        _logger.LogWarning("⚠️ Continuing without PostImage records - post will use ImageUrls field only");
                    }
                }

                // Step 6: Fetch and return the created post
                _logger.LogInformation("Fetching created post...");
                var createdPost = await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == post.Id);

                if (createdPost == null)
                {
                    return StatusCode(500, "Post was created but could not be retrieved");
                }

                var postDto = new PostDto
                {
                    Id = createdPost.Id,
                    Caption = createdPost.Content,
                    CreatedAt = createdPost.CreatedAt,
                    Likes = createdPost.NumberOfReacts,
                    Comments = createdPost.NumberOfComments,
                    Images = GetImageUrls(createdPost),
                    Username = createdPost.User?.Username ?? "Unknown",
                    ProfilePicture = createdPost.User?.ProfilePictureUrl ?? ""
                };

                _logger.LogInformation("=== POST CREATION DEBUG SUCCESS ===");
                return Ok(postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ FATAL ERROR in CreatePost");
                _logger.LogError("Error message: {Message}", ex.Message);
                if (ex.InnerException != null)
                {
                    _logger.LogError("Inner exception: {InnerMessage}", ex.InnerException.Message);
                }
                _logger.LogError("Stack trace: {StackTrace}", ex.StackTrace);

                return StatusCode(500, new
                {
                    error = "Post creation failed",
                    message = ex.Message,
                    innerException = ex.InnerException?.Message,
                    details = "Check server logs for full details"
                });
            }
        }

        // GET: api/Posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            try
            {
                var post = await _context.Posts
                    .Include(p => p.User)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    return NotFound("Post not found");
                }

                // Increment read count
                post.NumberOfReads++;
                await _context.SaveChangesAsync();

                var postDto = new PostDto
                {
                    Id = post.Id,
                    Caption = post.Content,
                    CreatedAt = post.CreatedAt,
                    Likes = post.NumberOfReacts,
                    Comments = post.NumberOfComments,
                    Images = GetImageUrls(post),
                    Username = post.User?.Username ?? "Unknown",
                    ProfilePicture = post.User?.ProfilePictureUrl ?? ""
                };

                return Ok(postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting post {PostId}", id);
                return StatusCode(500, "An error occurred while retrieving the post");
            }
        }

        // POST: api/Posts/{id}/react
        [HttpPost("{id}/react")]
        public async Task<ActionResult> ReactToPost(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user credentials");
                }

                var post = await _context.Posts.FindAsync(id);
                if (post == null)
                {
                    return NotFound("Post not found");
                }

                // Simple toggle for now - you can implement proper user-specific reactions later
                post.NumberOfReacts = Math.Max(0, post.NumberOfReacts == 0 ? 1 : 0);
                await _context.SaveChangesAsync();

                return Ok(new { likes = post.NumberOfReacts, liked = post.NumberOfReacts > 0 });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reacting to post {PostId}", id);
                return StatusCode(500, "An error occurred while processing the reaction");
            }
        }

        // Helper method to get all image URLs for a post
        private List<PostImageDto> GetImageUrls(Post post)
        {
            var imageList = new List<PostImageDto>();

            // Get images from the PostImage table (if available)
            if (post.Images != null && post.Images.Any())
            {
                imageList.AddRange(post.Images.Select(img => new PostImageDto
                {
                    ImageId = img.Id,
                    ImageUrl = img.ImageUrl,
                    DisplayOrder = img.DisplayOrder
                }).OrderBy(i => i.DisplayOrder));
            }
            else if (!string.IsNullOrEmpty(post.ImageUrls))
            {
                // Fallback to ImageUrls field
                try
                {
                    var urls = JsonSerializer.Deserialize<List<string>>(post.ImageUrls);
                    if (urls != null)
                    {
                        imageList.AddRange(urls.Select((url, index) => new PostImageDto
                        {
                            ImageId = 0, // No specific ID from ImageUrls field
                            ImageUrl = url,
                            DisplayOrder = index
                        }));
                    }
                }
                catch
                {
                    // If JSON fails, try comma-separated
                    var urls = post.ImageUrls.Split(',', StringSplitOptions.RemoveEmptyEntries);
                    imageList.AddRange(urls.Select((url, index) => new PostImageDto
                    {
                        ImageId = 0,
                        ImageUrl = url.Trim(),
                        DisplayOrder = index
                    }));
                }
            }
            else if (!string.IsNullOrEmpty(post.CoverImageUrl))
            {
                // If no other images, use cover image
                imageList.Add(new PostImageDto
                {
                    ImageId = 0,
                    ImageUrl = post.CoverImageUrl,
                    DisplayOrder = 0
                });
            }

            return imageList;
        }
    }

    // Keep the same DTOs
    public class CreatePostRequest
    {
        public string Caption { get; set; } = string.Empty;
        public List<IFormFile> Files { get; set; } = new List<IFormFile>();
    }

    public class PostDto
    {
        public int Id { get; set; }
        public string Caption { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public List<PostImageDto> Images { get; set; } = new List<PostImageDto>();
        public string Username { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
    }

    public class PostImageDto
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}