using Microsoft.AspNetCore.Mvc;
using webchat.DTO.Models;
using webchat.Services.Interfaces;

namespace webchat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            var result = await _accountService.RegisterAsync(model, ModelState);
            return result;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            var result = await _accountService.LoginAsync(model, ModelState);
            return result;
        }
    }
}

//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using ChatApp.Models;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;
//using webchat.Services.Interfaces;

//namespace webchat.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AccountController : ControllerBase
//    {
//        private readonly UserManager<ApplicationUser> _userManager;
//        private readonly SignInManager<ApplicationUser> _signInManager;
//        private readonly IConfiguration _configuration;

//        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
//        {
//            _userManager = userManager;
//            _signInManager = signInManager;
//            _configuration = configuration;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            var existingUser = await _userManager.FindByEmailAsync(model.Email);
//            if (existingUser != null)
//            {
//                return BadRequest("Email Already Exists");
//            }

//            var user = new ApplicationUser
//            {
//                UserName = model.Username,
//                Email = model.Email,
//                Bio = model.Bio,
//                ProfilePic = model.ProfilePic
//            };

//            var result = await _userManager.CreateAsync(user, model.Password);

//            if (result.Succeeded)
//            {
//                return Ok(new { Message = "Registration Successful" });
//            }
//            return BadRequest(result.Errors.Select(e => e.Description));
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            if (string.IsNullOrEmpty(model.Username) && string.IsNullOrEmpty(model.Email))
//            {
//                return BadRequest("Email OR Username is required.");
//            }

//            ApplicationUser user = null;


//            if (!string.IsNullOrEmpty(model.Email))
//            {
//                user = await _userManager.FindByEmailAsync(model.Email);
//            }

//            if (user == null && !string.IsNullOrEmpty(model.Username))
//            {
//                user = await _userManager.FindByNameAsync(model.Username);
//            }

//            if (user == null)
//            {
//                return BadRequest("User doesn't exist");
//            }

//            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);

//            if (result.Succeeded)
//            {

//                var token = GenerateJwtToken(user);
//                return Ok(new { Message = "Login successful", Token = token });
//            }

//            return Unauthorized("Invalid login attempt.");
//        }


//        private string GenerateJwtToken(ApplicationUser user)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.NameIdentifier, user.Id),
//                new Claim(ClaimTypes.Name, user.UserName),
//                new Claim(ClaimTypes.Email, user.Email),
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var expires = DateTime.Now.AddHours(1);

//            var token = new JwtSecurityToken(
//                issuer: _configuration["Jwt:Issuer"],
//                audience: _configuration["Jwt:Audience"],
//                claims: claims,
//                expires: expires,
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }

//}




//namespace ChatApp.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class LoginController : ControllerBase
//    {
//        private readonly SignInManager<ApplicationUser> _signInManager;

//        public LoginController(SignInManager<ApplicationUser> signInManager)
//        {
//            _signInManager = signInManager;
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
//        {
//            if (!ModelState.IsValid)
//            {
//                // If model state is invalid, return bad request with validation errors.
//                return BadRequest(ModelState);
//            }

//            // If both Email and Username are null, return a bad request.
//            if (string.IsNullOrEmpty(model.Username) && string.IsNullOrEmpty(model.Email))
//            {
//                return BadRequest("Username or Email is required.");
//            }

//            // Attempt to sign in based on either Username or Email
//            var user = await _signInManager.UserManager.FindByEmailAsync(model.Email);

//            if (user == null && !string.IsNullOrEmpty(model.Username))
//            {
//                // If the user is not found by email, try finding by username
//                user = await _signInManager.UserManager.FindByNameAsync(model.Username);
//            }

//            if (user == null)
//            {
//                return Unauthorized("Invalid login attempt.");
//            }

//            // Attempt to sign the user in with the password.
//            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);

//            if (result.Succeeded)
//            {
//                // Login successful, you can add JWT token generation here if required.
//                return Ok(new { Message = "Login successful" });
//            }

//            // If login failed, return unauthorized
//            return Unauthorized("Invalid login attempt.");
//        }
//    }
//}





//namespace ChatApp.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class RegisterController : ControllerBase
//    {
//        private readonly UserManager<ApplicationUser> _userManager;
//        private readonly SignInManager<ApplicationUser> _signInManager;

//        public RegisterController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
//        {
//            _userManager = userManager;
//            _signInManager = signInManager;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
//        {
//            if (!ModelState.IsValid)
//            {
//                // If the model state is invalid, return bad request with validation errors.
//                return BadRequest(ModelState);
//            }

//            // Check if the username or email already exists.
//            var existingUser = await _userManager.FindByEmailAsync(model.Email);
//            if (existingUser != null)
//            {
//                // Email already exists
//                return BadRequest("Email is already registered.");
//            }

//            // Create the user.
//            var user = new ApplicationUser
//            {
//                UserName = model.Username,
//                Email = model.Email,
//                Bio = model.Bio,
//                ProfilePic = model.ProfilePic
//            };

//            // Attempt to create the user with the password.
//            var result = await _userManager.CreateAsync(user, model.Password);

//            if (result.Succeeded)
//            {
//                // Optionally, you can sign in the user after successful registration.
//                await _signInManager.SignInAsync(user, isPersistent: false);

//                // Return a success response (you can modify this response as needed).
//                return Ok(new { Message = "Registration successful" });
//            }

//            // If the user creation failed, return the error messages.
//            return BadRequest(result.Errors.Select(e => e.Description));
//        }
//    }
//}
