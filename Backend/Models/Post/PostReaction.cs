using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Post
{
    public class PostReact
    {
        [Key]
        public int Id { get; set; }

        public int PostId { get; set; }

        [ForeignKey("PostId")]
        public Post Post { get; set; } = null!;

        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public UserNew User { get; set; } = null!;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

       
    }
}