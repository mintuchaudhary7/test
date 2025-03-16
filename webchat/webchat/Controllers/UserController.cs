using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webchat.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace webchat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _applicationDbContext;

        public UserController(IUserService userService, ApplicationDbContext applicationDbContext)
        {
            _userService = userService;
            _applicationDbContext = applicationDbContext;
        }


        [HttpGet("SearchUserByUsername/{Username}")]
        public async Task<IActionResult> SesrchUserByUsername( string Username)
        {
            var result = await _userService.SesrchUserByUsername(Username);
            return result;
        }


        [HttpGet("getData")]
        [Authorize]
        public async Task<IActionResult> GetData()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _userService.GetUserInfo(userId);
           

            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            return result;
        }

        
        [HttpGet("getUserInfoById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            var result = await _userService.GetUserInfo(id);
            return result;
        }

        [HttpGet("GetUserChats")]
        public async Task<IActionResult> GetUserChats(string userId)
        {
            var userChats = await _applicationDbContext.Chats
                .Where(c => c.Members.Any(m => m.Id == userId))
                .Include(c => c.Messages)
                .ThenInclude(m => m.Sender) 
                .Include(c => c.Members)
                .ToListAsync();

            var result = userChats.Select(chat => new
            {
                ChatId = chat.GroupId,
                IsGroup = chat.IsGroup,
                Messages = chat.Messages.Select(msg => new
                {
                    MessageId = msg.MessageId,
                    Content = msg.Content,
                    Sender = msg.Sender.UserName,
                    Timestamp = msg.Timestamp
                }).ToList()
            }).ToList();

            return new OkObjectResult(result);
        }

        [HttpPatch("UpdateBio")]
        [Authorize]
        public async Task<IActionResult> UpdateUserBio([FromBody] string bio)
        {
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            

            var result = await _userService.UpdateUserBio(bio, userId);

            return result;

            //if (string.IsNullOrEmpty(bio))
            //{
            //    return BadRequest("Bio cannot be empty.");
            //}

            //// Retrieve the user from the database using the userId
            //var user = await _applicationDbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            //if (user == null)
            //{
            //    return NotFound("User not found.");
            //}

            //// Update the user's bio
            //user.Bio = bio;

            //// Save changes to the database
            //try
            //{
            //    await _applicationDbContext.SaveChangesAsync();
            //    return Ok("Bio updated successfully.");
            //}
            //catch (Exception ex)
            //{
            //    return StatusCode(500, $"An error occurred while updating the bio: {ex.Message}");
            //}
        }



    }
}
