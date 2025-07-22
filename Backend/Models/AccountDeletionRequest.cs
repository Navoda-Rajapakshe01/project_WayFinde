using System;

namespace Backend.Models {
    public class AccountDeletionRequest
    {
        public required int Id { get; set; }
        public required Guid UserId { get; set; }
        public required DateTime RequestedAt { get; set; }
        public required string Status { get; set; } 
        public string? AdminReply { get; set; }
    }
}
