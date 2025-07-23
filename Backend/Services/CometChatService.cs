using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class CometChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _appId;
        private readonly string _apiKey;
        private readonly string _region;

        public CometChatService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _appId = configuration["CometChat:AppId"];
            _apiKey = configuration["CometChat:ApiKey"];
            _region = configuration["CometChat:Region"];
        }

        public async Task<bool> CreateUserAsync(string uid, string name)
        {
            var url = $"https://api-{_region}.cometchat.io/v3/users";
            var body = new { uid, name };
            var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("appId", _appId);
            _httpClient.DefaultRequestHeaders.Add("apiKey", _apiKey);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            var response = await _httpClient.PostAsync(url, content);
            return response.IsSuccessStatusCode;
        }
    }
} 