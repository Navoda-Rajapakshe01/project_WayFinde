namespace Backend.DTO
{
    public class CreateCommentDto
    {
        public Guid UserId { get; set; }
        public int BlogId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
