using System;

namespace Backend.DTOs
{
    public class UserSearchDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; }
        public string ProfilePictureUrl { get; set; }

    }
}