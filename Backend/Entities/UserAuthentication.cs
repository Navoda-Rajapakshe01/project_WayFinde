namespace Backend.Entities
{
    public class UserAuthentication
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;    
    }
}
