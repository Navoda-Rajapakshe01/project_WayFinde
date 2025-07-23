using Backend.Data;
using Backend.Models;
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
                    Content = p.Content,
                    CreatedAt = p.CreatedAt,
                    Likes = p.NumberOfReacts,
                    Comments = p.NumberOfComments,
                    Images = GetImageUrls(p),
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
                _logger.LogInformation($"Content: '{request.Content}'");
                _logger.LogInformation($"Files count: {request.Files?.Count ?? 0}");

                // Check if user exists
                var userExists = await _context.UsersNew.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return BadRequest($"User with ID {userId} not found in database");
                }
                _logger.LogInformation("✅ User exists in database");

                // Upload images to Cloudinary
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

                // Create post object
                var post = new Post
                {
                    Title = string.IsNullOrEmpty(request.Content) ? "Untitled" :
                           (request.Content.Length > 50 ? request.Content.Substring(0, 50) + "..." : request.Content),
                    Content = request.Content ?? string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UserId = userId,
                    Tags = string.Empty,
                    NumberOfComments = 0,
                    NumberOfReads = 0,
                    NumberOfReacts = 0,
                    CoverImageUrl = coverImageUrl,
                    ImageUrls = uploadedImageUrls.Any() ? JsonSerializer.Serialize(uploadedImageUrls) : string.Empty
                };

                _logger.LogInformation("Post object created");

                // Save the post
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"✅ Post saved successfully with ID: {post.Id}");

                // Create PostImage records
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

                            _context.PostImages.Add(postImage);
                        }

                        await _context.SaveChangesAsync();
                        _logger.LogInformation("✅ PostImage records saved successfully");
                    }
                    catch (Exception postImageEx)
                    {
                        _logger.LogError(postImageEx, "❌ Error saving PostImage records");
                        _logger.LogWarning("⚠️ Continuing without PostImage records");
                    }
                }

                // Fetch and return the created post
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
                    Content = createdPost.Content,
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
        public async Task<ActionResult<object>> GetPost(int id)
        {
            try
            {
                var post = await _context.Posts
                    .Include(p => p.Images)
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    return NotFound("Post not found");
                }

                // Get comment count
                var commentCount = await _context.PostComments
                    .CountAsync(c => c.PostId == id);

                // Get like count
                var likeCount = await _context.PostReactions
                    .CountAsync(r => r.PostId == id);

                var result = new
                {
                    id = post.Id,
                    title = post.Title,
                    content = post.Content,
                    createdAt = post.CreatedAt,
                    userId = post.UserId,
                    username = post.User.Username,
                    likes = likeCount,
                    comments = commentCount,
                    images = GetImageUrls(post).Select(img => new { imageUrl = img.ImageUrl }),
                    user = new
                    {
                        id = post.User.Id,
                        username = post.User.Username,
                        profilePictureUrl = post.User.ProfilePictureUrl
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting post {PostId}", id);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Posts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user credentials");
                }

                var post = await _context.Posts
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    return NotFound("Post not found");
                }

                if (post.UserId != userId)
                {
                    return Forbid("You can only delete your own posts");
                }

                // Delete related images
                if (post.Images != null && post.Images.Any())
                {
                    _context.PostImages.RemoveRange(post.Images);
                }

                // Delete the post
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting post {PostId}", id);
                return StatusCode(500, "An error occurred while deleting the post");
            }
        }

        // GET: api/Posts/{postId}/comments
        [HttpGet("{postId}/comments")]
        public async Task<ActionResult<IEnumerable<object>>> GetPostComments(int postId)
        {
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                {
                    return NotFound("Post not found");
                }

                var comments = await _context.PostComments
                    .Where(c => c.PostId == postId)
                    .Include(c => c.User)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new
                    {
                        id = c.Id,
                        content = c.Content,
                        createdAt = c.CreatedAt,
                        user = new
                        {
                            id = c.User.Id,
                            username = c.User.Username,
                            profilePictureUrl = c.User.ProfilePictureUrl
                        }
                    })
                    .ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting comments for post {PostId}", postId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Posts/{postId}/comments
        [HttpPost("{postId}/comments")]
        public async Task<ActionResult<object>> AddPostComment(int postId, [FromBody] CreateCommentRequest request)
        {
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                {
                    return NotFound("Post not found");
                }

                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user ID");
                }

                var user = await _context.UsersNew.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized("User not found");
                }

                if (string.IsNullOrWhiteSpace(request.Content))
                {
                    return BadRequest("Comment content cannot be empty");
                }

                var comment = new PostComment
                {
                    PostId = postId,
                    UserId = userId,
                    Content = request.Content.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.PostComments.Add(comment);
                await _context.SaveChangesAsync();

                // Get the updated comment count
                var commentCount = await _context.PostComments
                    .CountAsync(c => c.PostId == postId);

                // Return the created comment with user info
                var result = new
                {
                    comment = new
                    {
                        id = comment.Id,
                        content = comment.Content,
                        createdAt = comment.CreatedAt,
                        user = new
                        {
                            id = user.Id,
                            username = user.Username,
                            profilePictureUrl = user.ProfilePictureUrl
                        }
                    },
                    postCommentCount = commentCount
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding comment to post {PostId}", postId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Posts/comment/{commentId}
        [HttpDelete("comment/{commentId}")]
        public async Task<ActionResult> DeleteComment(int commentId)
        {
            try
            {
                var comment = await _context.PostComments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == commentId);

                if (comment == null)
                {
                    return NotFound("Comment not found");
                }

                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user ID");
                }

                if (comment.UserId != userId)
                {
                    return Forbid("You can only delete your own comments");
                }

                _context.PostComments.Remove(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting comment {CommentId}", commentId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Posts/{postId}/react
        [HttpPost("{postId}/react")]
        public async Task<ActionResult<object>> TogglePostReaction(int postId)
        {
            try
            {
                var post = await _context.Posts.FindAsync(postId);
                if (post == null)
                {
                    return NotFound("Post not found");
                }

                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Invalid user ID");
                }

                // Check if user already reacted
                var existingReaction = await _context.PostReactions
                    .FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == userId);

                bool reacted;
                if (existingReaction != null)
                {
                    _context.PostReactions.Remove(existingReaction);
                    reacted = false;
                }
                else
                {
                    var reaction = new PostReaction
                    {
                        PostId = postId,
                        UserId = userId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.PostReactions.Add(reaction);
                    reacted = true;
                }

                await _context.SaveChangesAsync();

                // Get updated count
                var count = await _context.PostReactions
                    .CountAsync(r => r.PostId == postId);

                return Ok(new { reacted, count, likes = count, liked = reacted });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling reaction for post {PostId}", postId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Posts/{postId}/reactions/status
        [HttpGet("{postId}/reactions/status")]
        public async Task<ActionResult<bool>> GetUserReactionStatus(int postId)
        {
            try
            {
                var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                {
                    return Ok(false);
                }

                var hasReacted = await _context.PostReactions
                    .AnyAsync(r => r.PostId == postId && r.UserId == userId);

                return Ok(hasReacted);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reaction status for post {PostId}", postId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Posts/{postId}/reactions/count
        [HttpGet("{postId}/reactions/count")]
        public async Task<ActionResult<int>> GetPostReactionCount(int postId)
        {
            try
            {
                var count = await _context.PostReactions
                    .CountAsync(r => r.PostId == postId);

                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reaction count for post {PostId}", postId);
                return StatusCode(500, $"Internal server error: {ex.Message}");
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
                            ImageId = 0,
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

    // Request models
    public class CreateCommentRequest
    {
        public string Content { get; set; } = string.Empty;
    }

    public class CreatePostRequest
    {
        public string Content { get; set; } = string.Empty;
        public List<IFormFile> Files { get; set; } = new List<IFormFile>();
    }

    public class PostDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
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