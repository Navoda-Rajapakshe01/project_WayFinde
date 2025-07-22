using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserNew?> GetUserByIdAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var parsedId))
            {
                throw new ArgumentException("Invalid user ID format.", nameof(userId));
            }
            var user = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == parsedId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }
            return user;
        }

        public async Task<bool> UpdateUserAsync(Guid userId, string username, string email, string profilePicture)
        {
            var user = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return false;
            user.Username = username;
            user.ContactEmail = email;
            user.ProfilePictureUrl = profilePicture;
            await _context.SaveChangesAsync();
            return true;
        }

        //public async Task<bool> DeleteUserAsync(Guid userId)
        //{
        //    using var transaction = await _context.Database.BeginTransactionAsync();
        //    try
        //    {
        //        // First, delete all post comments by this user
        //        var userPostComments = await _context.PostComments
        //            .Where(pc => pc.UserId == userId)
        //            .ToListAsync();

        //        if (userPostComments.Any())
        //        {
        //            _context.PostComments.RemoveRange(userPostComments);
        //            await _context.SaveChangesAsync();
        //        }

        //        // Delete all blog comments by this user
        //        var userBlogComments = await _context.Comments
        //            .Where(c => c.UserId == userId)
        //            .ToListAsync();

        //        if (userBlogComments.Any())
        //        {
        //            _context.Comments.RemoveRange(userBlogComments);
        //            await _context.SaveChangesAsync();
        //        }

        //        // Then, delete all posts by this user (this will cascade delete remaining post comments)
        //        var userPosts = await _context.Posts
        //            .Where(p => p.UserId == userId)
        //            .ToListAsync();

        //        if (userPosts.Any())
        //        {
        //            _context.Posts.RemoveRange(userPosts);
        //            await _context.SaveChangesAsync();
        //        }

        //        // Delete all blogs by this user (this will cascade delete remaining blog comments)
        //        var userBlogs = await _context.Blogs
        //            .Where(b => b.UserId == userId)
        //            .ToListAsync();

        //        if (userBlogs.Any())
        //        {
        //            _context.Blogs.RemoveRange(userBlogs);
        //            await _context.SaveChangesAsync();
        //        }

        //        // Finally, delete the user
        //        var user = await _context.UsersNew.FirstOrDefaultAsync(u => u.Id == userId);
        //        if (user == null)
        //        {
        //            await transaction.RollbackAsync();
        //            return false; // User not found
        //        }

        //        _context.UsersNew.Remove(user);
        //        await _context.SaveChangesAsync();

        //        await transaction.CommitAsync();
        //        return true;
        //    }
        //    catch (Exception)
        //    {
        //        await transaction.RollbackAsync();
        //        throw;
        //    }
        //}

        //// Alternative method with string userId parameter
        //public async Task<bool> DeleteUserAsync(string userId)
        //{
        //    if (!Guid.TryParse(userId, out var parsedId))
        //    {
        //        throw new ArgumentException("Invalid user ID format.", nameof(userId));
        //    }

        //    return await DeleteUserAsync(parsedId);
        //}
    }
}