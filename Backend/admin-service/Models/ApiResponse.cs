using System.Text.Json.Serialization;

namespace Connexus.AdminService.Models;

public class ApiResponse<T>
{
    [JsonPropertyName("timeStamp")]
    public string? TimeStamp { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("error")]
    public ApiError? Error { get; set; }

    public ApiResponse()
    {
        TimeStamp = DateTime.Now.ToString("HH:mm:ss dd-MM-yyyy");
    }

    public ApiResponse(T data) : this()
    {
        Data = data;
    }

    public ApiResponse(ApiError error) : this()
    {
        Error = error;
    }
}

public class ApiError
{
    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("errors")]
    public List<string>? Errors { get; set; }
}
