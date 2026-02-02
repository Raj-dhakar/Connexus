using Microsoft.AspNetCore.Mvc;
using Connexus.AdminService.Services;
using Connexus.AdminService.Models;

namespace Connexus.AdminService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IJavaServiceClient _javaService;

    public AdminController(IJavaServiceClient javaService)
    {
        _javaService = javaService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<object>>> GetStats()
    {
        var users = await _javaService.GetUsersAsync();
        var recruiters = await _javaService.GetRecruitersAsync();
        var posts = await _javaService.GetPostsAsync();

        var stats = new
        {
            TotalUsers = users.Count,
            TotalRecruiters = recruiters.Count,
            TotalPosts = posts.Count,
            CandidateCount = users.Count(u => u.Role == "ROLE_USER"),
            RecentUsers = users.TakeLast(5).Reverse().ToList()
        };

        return Ok(new ApiResponse<object>(stats));
    }

    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetAllUsers()
    {
        var users = await _javaService.GetUsersAsync();
        return Ok(new ApiResponse<List<UserDto>>(users));
    }

    [HttpGet("recruiters")]
    public async Task<ActionResult<ApiResponse<List<RecruiterDto>>>> GetAllRecruiters()
    {
        var recruiters = await _javaService.GetRecruitersAsync();
        return Ok(new ApiResponse<List<RecruiterDto>>(recruiters));
    }

    [HttpDelete("users/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteUser(long id)
    {
        await _javaService.DeleteUserAsync(id);
        return Ok(new ApiResponse<string>("User deleted successfully"));
    }

    [HttpDelete("posts/{id}")]
    public async Task<ActionResult<ApiResponse<string>>> DeletePost(long id)
    {
        await _javaService.DeletePostAsync(id);
        return Ok(new ApiResponse<string>("Post deleted successfully"));
    }
}
