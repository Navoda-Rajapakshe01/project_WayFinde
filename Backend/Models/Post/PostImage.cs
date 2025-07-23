using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Post
{
    public class PostImage
    {
        public int Id { get; set; }

        public int PostId { get; set; }

        [ForeignKey("PostId")]
        public Backend.Models.Post.Post Post { get; set; } = null!;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;


    }
}