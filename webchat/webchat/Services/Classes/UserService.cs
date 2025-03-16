using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webchat.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace webchat.Services.Classes
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _applicationDbContext;

        public UserService(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _applicationDbContext = applicationDbContext;
        }

        public async Task<IActionResult> GetUserInfo(string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user == null)
            {
                return new NotFoundObjectResult(new { Message = "User not found" });
            }

           
            var userChats = await _applicationDbContext.Chats
                .Where(c => c.Members.Any(m => m.Id == user.Id)) // Find chats where the user is a member
                .Include(c => c.Messages)
                .ThenInclude(m => m.Sender)
                .Select(chat => new
                {
                    ChatId = chat.GroupId,
                    IsGroup = chat.IsGroup,

                    Members = chat.Members.Select(mem => new
                    {
                        mem.Id,
                        mem.UserName,
                        mem.ProfilePic
                    }).ToList(),

                    Messages = chat.Messages.Select(msg => new
                    {
                        msg.MessageId,
                        msg.Content,
                        Timestamp = msg.Timestamp,
                        Sender = new
                        {
                            msg.Sender.UserName,
                            msg.Sender.ProfilePic
                        },
                        Reciever = new
                        {
                            msg.Receiver.UserName,
                            msg.Receiver.ProfilePic
                        }

                    }).ToList()
                }).ToListAsync();

            return new OkObjectResult(new
            {
                Message = "Data fetched successfully",
                User = new
                {
                    user.UserName,
                    user.Email,
                    user.ProfilePic,
                    user.Id,
                    bio = user.Bio,
                    Chats = userChats
                }
            });
        }

        public async Task<IActionResult> SesrchUserByUsername(string Username)
        {
            var user = await _userManager.FindByNameAsync(Username);

            if(user != null)
            {
                return new OkObjectResult(new { Message = "User Found",
                    User = new
                    {
                        user.UserName,
                        user.Email,
                        user.ProfilePic,
                        user.Id,
                        bio = user.Bio,
                    }
                });
            }

            return new BadRequestObjectResult(new { Message = "User Not Found" });
        }

        public async Task<IActionResult> UpdateUserBio(string bio, string userId)
        {
            if (string.IsNullOrEmpty(bio))
            {
                return new BadRequestObjectResult("Bio cannot be empty.");
            }


            // var user = await _applicationDbContext.Users.FindByIdAsync(u => u.Id == userId);
            //var user = await _userManager.FindByIdAsync(userId);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new NotFoundObjectResult("User not found.");
            }

          
            user.Bio = bio;

       
                await _applicationDbContext.SaveChangesAsync();
                return new OkObjectResult("Bio updated successfully.");
           
        }
    }
}


