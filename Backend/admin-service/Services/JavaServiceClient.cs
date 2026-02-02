using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Connexus.AdminService.Models;

namespace Connexus.AdminService.Services;

public interface IJavaServiceClient
{
    Task<List<UserDto>> GetUsersAsync();
    Task<List<RecruiterDto>> GetRecruitersAsync();
    Task<List<PostDto>> GetPostsAsync();
    Task DeleteUserAsync(long id);
    Task DeletePostAsync(long id);
}

public class JavaServiceClient : IJavaServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public JavaServiceClient(HttpClient httpClient, IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _config = config;
        _httpContextAccessor = httpContextAccessor;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<List<UserDto>> GetUsersAsync()
    {
        var baseUrl = _config["JavaServices:UserServiceUrl"];
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<UserDto>>>($"{baseUrl}/users/all", _jsonOptions);
        return response?.Data ?? new List<UserDto>();
    }

    public async Task<List<RecruiterDto>> GetRecruitersAsync()
    {
        var baseUrl = _config["JavaServices:UserServiceUrl"];
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<RecruiterDto>>>($"{baseUrl}/recruiters", _jsonOptions);
        return response?.Data ?? new List<RecruiterDto>();
    }

    public async Task<List<PostDto>> GetPostsAsync()
    {
        var baseUrl = _config["JavaServices:PostServiceUrl"];
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<PostDto>>>($"{baseUrl}/posts", _jsonOptions);
        return response?.Data ?? new List<PostDto>();
    }

    public async Task DeleteUserAsync(long id)
    {
        var baseUrl = _config["JavaServices:UserServiceUrl"];
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{baseUrl}/users/{id}");
        AddAuthHeaders(request);
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeletePostAsync(long id)
    {
        var baseUrl = _config["JavaServices:PostServiceUrl"];
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{baseUrl}/posts/{id}");
        AddAuthHeaders(request);
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    private void AddAuthHeaders(HttpRequestMessage request)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return;

        // Relay JWT Authorization header
        var authHeader = httpContext.Request.Headers["Authorization"].ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            request.Headers.TryAddWithoutValidation("Authorization", authHeader);
        }

        // Relay Context Headers added by Gateway
        var userIdHeader = httpContext.Request.Headers["X-User-Id"].ToString();
        if (!string.IsNullOrEmpty(userIdHeader))
        {
            request.Headers.TryAddWithoutValidation("X-User-Id", userIdHeader);
        }

        var roleHeader = httpContext.Request.Headers["X-Role"].ToString();
        if (!string.IsNullOrEmpty(roleHeader))
        {
            request.Headers.TryAddWithoutValidation("X-Role", roleHeader);
        }
    }
}
