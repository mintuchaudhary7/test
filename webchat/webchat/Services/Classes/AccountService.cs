using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.IdentityModel.Tokens;
using webchat.DTO.Models;
using webchat.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class AccountService : IAccountService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _applicationDbContext;

    public AccountService(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _applicationDbContext = applicationDbContext;
    }

    public async Task<IActionResult> RegisterAsync(RegisterModel model, ModelStateDictionary modelState)
    {
        try
        {
            
            if (!modelState.IsValid)
            {
                return new BadRequestObjectResult(new
                {
                    Message = "Invalid registration data.",
                    Errors = modelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

           
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return new BadRequestObjectResult(new { Message = "Email already exists." });
            }

           
            var user = new ApplicationUser
            {
                UserName = model.Username,
                Email = model.Email,
                Bio = model.Bio,
                ProfilePic = model.ProfilePic
            };

            
            var result = await _userManager.CreateAsync(user, model.Password);

            
            if (result.Succeeded)
            {
                return new OkObjectResult(new { Message = "Registration successful" });
            }

            
            return new BadRequestObjectResult(new
            {
                Message = "Registration failed.",
                Errors = result.Errors.Select(e => e.Description)
            });
        }
        catch (ArgumentNullException e)
        {
          
            return new BadRequestObjectResult(new { Message = $"Required argument is missing: {e.Message}" });
        }
        catch (Exception ex)
        {
            

            return new StatusCodeResult(500);
        }
    }



    public async Task<IActionResult> LoginAsync(LoginModel model, ModelStateDictionary modelState)
    {
        try
        {
           
            if (!modelState.IsValid)
            {
                return new BadRequestObjectResult(new
                {
                    Message = "Invalid model data.",
                    Errors = modelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

          
            if (string.IsNullOrEmpty(model.Username) && string.IsNullOrEmpty(model.Email))
            {
                return new BadRequestObjectResult(new { Message = "Email OR Username is required." });
            }

            ApplicationUser user = null;

           
            if (!string.IsNullOrEmpty(model.Email))
            {
                user = await _userManager.FindByEmailAsync(model.Email);
            }

            
            if (user == null && !string.IsNullOrEmpty(model.Username))
            {
                user = await _userManager.FindByNameAsync(model.Username);
            }

           
            if (user == null)
            {
                return new BadRequestObjectResult(new { Message = "User doesn't exist, Please SignUp" });
            }

            
            if (string.IsNullOrEmpty(model.Password))
            {
                return new BadRequestObjectResult(new { Message = "Password Field is required" });
            }

           
            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
              
                var token = GenerateJwtToken(user);

                
                var userChats = await _applicationDbContext.Chats
                    .Where(c => c.Members.Any(m => m.Id == user.Id))
                    .Include(c => c.Messages)
                    .ThenInclude(m => m.Sender)
                    .Select(chat => new
                    {
                        ChatId = chat.GroupId,
                        IsGroup = chat.IsGroup,
                        Messages = chat.Messages.Select(msg => new
                        {
                            msg.MessageId,
                            msg.Content,
                            Timestamp = msg.Timestamp,
                            Sender = new
                            {
                                msg.Sender.UserName,
                                msg.Sender.ProfilePic
                            }
                        }).ToList()
                    }).ToListAsync();

               
                return new OkObjectResult(new
                {
                    Message = "Login successful",
                    Token = token,
                    User = new
                    {
                        user.UserName,
                        user.Email,
                        user.ProfilePic,
                        Chats = userChats
                    }
                });
            }

            return new BadRequestObjectResult(new { Message = "Invalid username or password." });
        }
        catch (ArgumentNullException e)
        {
           
            return new BadRequestObjectResult(new { Message = $"Required argument is missing: {e.Message}" });
        }
        catch (Exception ex)
        {
            return new BadRequestObjectResult(new { Message = "An unexpected error occurred. Please try again later.", Error = ex.Message });
        }
    }





    public string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.Now.AddHours(1);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
