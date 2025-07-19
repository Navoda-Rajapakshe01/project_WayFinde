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
            // Get a valid API key from https://www.weatherapi.com/
            _apiKey = "8d0063bf13b1431591565611251907"; // Replace with your valid WeatherAPI.com key
        }

        public async Task<Weather> GetWeatherAsync(string location)
        {
            try
            {
                // Handle Sri Lankan place names better by appending "Sri Lanka" if not present
                string searchLocation = location;
                if (!location.ToLower().Contains("sri lanka"))
                {
                    searchLocation = $"{location}, Sri Lanka";
                }

                var response = await _httpClient.GetAsync($"{BaseUrl}/current.json?key={_apiKey}&q={Uri.EscapeDataString(searchLocation)}&aqi=no");
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Weather API error: {response.StatusCode} - {errorContent}");
                }
                
                var jsonResponse = await response.Content.ReadAsStringAsync();
                var weatherData = JsonSerializer.Deserialize<JsonElement>(jsonResponse);
                
                var current = weatherData.GetProperty("current");
                var locationData = weatherData.GetProperty("location");
                
                return new Weather
                {
                    Temperature = current.GetProperty("temp_c").GetDouble(),
                    FeelsLike = current.GetProperty("feelslike_c").GetDouble(),
                    Humidity = current.GetProperty("humidity").GetInt32(),
                    Description = current.GetProperty("condition").GetProperty("text").GetString() ?? "",
                    Icon = current.GetProperty("condition").GetProperty("icon").GetString() ?? "",
                    WindSpeed = current.GetProperty("wind_kph").GetDouble(),
                    LastUpdated = DateTime.Parse(current.GetProperty("last_updated").GetString() ?? DateTime.UtcNow.ToString()),
                    Location = locationData.GetProperty("name").GetString() ?? location
                };
            }
            catch (JsonException ex)
            {
                throw new Exception($"Error parsing weather data: {ex.Message}");
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"Error connecting to weather service: {ex.Message}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching weather data for {location}: {ex.Message}");
            }
        }
    }
}