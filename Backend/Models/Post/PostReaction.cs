using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models.Post
{
   
        public class PostReaction
        {
            public int Id { get; set; }
            public int PostId { get; set; }
            public Post Post { get; set; } = null!;
            public Guid UserId { get; set; }
            public UserNew User { get; set; } = null!;
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        }
    
}
