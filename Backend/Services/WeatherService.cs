using System.Net.Http;
using System.Text.Json;
using Backend.Models;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public interface IWeatherService
    {
        Task<Weather> GetWeatherAsync(string location);
    }

    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private const string BaseUrl = "http://api.weatherapi.com/v1";

        public WeatherService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = "8bfbf09eafdd4cbbb64131601251105"; // Your API key
        }

        public async Task<Weather> GetWeatherAsync(string location)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/current.json?key={_apiKey}&q={location}");
                response.EnsureSuccessStatusCode();
                
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var weatherData = JsonSerializer.Deserialize<JsonElement>(jsonResponse);
                
                var current = weatherData.GetProperty("current");
                
                return new Weather
                {
                    Temperature = current.GetProperty("temp_c").GetDouble(),
                    FeelsLike = current.GetProperty("feelslike_c").GetDouble(),
                    Humidity = current.GetProperty("humidity").GetInt32(),
                    Description = current.GetProperty("condition").GetProperty("text").GetString() ?? "",
                    Icon = current.GetProperty("condition").GetProperty("icon").GetString() ?? "",
                    WindSpeed = current.GetProperty("wind_kph").GetDouble(),
                    LastUpdated = DateTime.Parse(current.GetProperty("last_updated").GetString() ?? DateTime.UtcNow.ToString()),
                    Location = location
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching weather data: {ex.Message}");
            }
        }
    }
} 