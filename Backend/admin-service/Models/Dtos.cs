namespace Connexus.AdminService.Models;

public class UserDto
{
    public long Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string? Role { get; set; }
    public string? Designation { get; set; }
    public string? ProfileImage { get; set; }
    public string? Location { get; set; }
    public List<string>? Skills { get; set; }
    public string? ExpType { get; set; }
}

public class RecruiterDto
{
    public long Id { get; set; }
    public string? CompanyName { get; set; }
    public string? CompanySize { get; set; }
    public string? Industry { get; set; }
    public long UserId { get; set; }
}

public class PostDto
{
    public long PostId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? MediaUrl { get; set; }
    public long UserId { get; set; }
    public string? Username { get; set; }
    public string? CreatedAt { get; set; }
}
