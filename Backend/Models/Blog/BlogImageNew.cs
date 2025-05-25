namespace Backend.Models
{
    public class BlogImageNew
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;

        public int BlogId { get; set; }
        public Blog Blog { get; set; } = null!;
    }
}
