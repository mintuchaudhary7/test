using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webchat.Services.Interfaces;

namespace webchat.Services.Classes
{
    public class ChatService : IChatService
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public ChatService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        
        public async Task<IActionResult> GetChatByChatId(string chatId)
        {
            Guid id = Guid.Parse(chatId);
            var chat = await _applicationDbContext.Chats
                .Where(c => c.GroupId == id) 
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
                        senderName = msg.Sender.UserName,
                        RecieverName = msg.Receiver.UserName

                        
                        //Sender = new
                        //{
                        //    msg.Sender.UserName,
                        //    msg.Sender.ProfilePic
                        //},
                        //Reciever = new
                        //{
                        //    msg.Receiver.UserName,
                        //    msg.Receiver.ProfilePic
                        //}

                    }).ToList()
                })
                .ToListAsync(); 

            // Check if chat is found
            if (chat == null)
            {
                return new NotFoundObjectResult("Chat not found.");
            }

            // Return the chat object wrapped in an OkObjectResult
            return new OkObjectResult(chat);
        }

        // Check if a chat exists between two users
        public async Task<IActionResult> CheckChatExists(string userId1, string userId2)
        {
            var existingChat = await _applicationDbContext.Chats
                .Where(c => !c.IsGroup &&
                            c.Members.Any(m => m.Id == userId1) &&
                            c.Members.Any(m => m.Id == userId2))
                .FirstOrDefaultAsync();

            if (existingChat != null)
            {

                return new OkObjectResult(new { exists = true, chat = existingChat });
            }

            return new OkObjectResult(new { exists = false });
        }

        public async Task<IActionResult> CreatePrivateChat(string userId1, string userId2)
        {
            
            var existingChat = await _applicationDbContext.Chats
                .Where(c => !c.IsGroup &&
                            c.Members.Any(m => m.Id == userId1) &&
                            c.Members.Any(m => m.Id == userId2))
                .FirstOrDefaultAsync();

            if (existingChat != null)
            {
                return new OkObjectResult(new { message = "Chat already exists", chat = existingChat });
            }

            // If no chat exists, create a new one
            var user1 = await _applicationDbContext.Users.FindAsync(userId1);
            var user2 = await _applicationDbContext.Users.FindAsync(userId2);

            if (user1 == null || user2 == null)
            {
                return new NotFoundObjectResult("One or both users not found.");
            }

            var newChat = new Chat
            {
                IsGroup = false,
                Members = new List<ApplicationUser> { user1, user2 }
            };

            _applicationDbContext.Chats.Add(newChat);
            await _applicationDbContext.SaveChangesAsync();

            return new OkObjectResult(new { message = "Private chat created", chat = newChat });
        }


        public async Task<IActionResult> CreateGroupChat(List<string> userIds, string chatName)
        {
            var users = await _applicationDbContext.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

            if (users.Count != userIds.Count)
            {
                return new BadRequestObjectResult("Some users not found.");
            }

            var newChat = new Chat
            {
                IsGroup = true,
                Admins = new List<ApplicationUser> { users.First() }, // Assigning first user to admin role
                Members = users
            };

            _applicationDbContext.Chats.Add(newChat);
            await _applicationDbContext.SaveChangesAsync();

            return new OkObjectResult(new { message = "Group chat created", chat = newChat });
        }

    }
}



////using Microsoft.AspNetCore.Mvc;
////using Microsoft.EntityFrameworkCore;
////using webchat.Services.Interfaces;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using webchat.Services.Interfaces;
////using webchat.Models;

//namespace webchat.Services.Classes
//{
//    public class ChatService : IChatService
//    {
//        private readonly ApplicationDbContext _applicationDbContext;

//        public ChatService(ApplicationDbContext applicationDbContext)
//        {
//            _applicationDbContext = applicationDbContext;
//        }

//        // Existing method to get a chat by ChatId
//        public async Task<IActionResult> GetChatByChatId(string chatId)
//        {
//            Guid id = Guid.Parse(chatId);
//            var chat = await _applicationDbContext.Chats
//                .Where(c => c.GroupId == id)
//                .Select(chat => new
//                {
//                    ChatId = chat.GroupId,
//                    IsGroup = chat.IsGroup,
//                    Messages = chat.Messages.Select(msg => new
//                    {
//                        msg.MessageId,
//                        msg.Content,
//                        Timestamp = msg.Timestamp,
//                        senderName = msg.Sender.UserName,
//                        recieverName = msg.Receiver.UserName
//                    }).ToList()
//                })
//                .FirstOrDefaultAsync();

//            if (chat == null)
//            {
//                return new NotFoundObjectResult("Chat not found.");
//            }

//            return new OkObjectResult(chat);
//        }

//        // Check if a chat exists between two users
//        public async Task<IActionResult> CheckChatExists(string userId1, string userId2)
//        {
//            var existingChat = await _applicationDbContext.Chats
//                .Where(c => !c.IsGroup &&
//                            c.Members.Any(m => m.Id == userId1) &&
//                            c.Members.Any(m => m.Id == userId2))
//                .FirstOrDefaultAsync();

//            if (existingChat != null)
//            {
//                return new OkObjectResult(new { exists = true, chat = existingChat });
//            }

//            return new OkObjectResult(new { exists = false });
//        }

//        // Create a new private chat between two users
//        public async Task<IActionResult> CreatePrivateChat(string userId1, string userId2)
//        {
//            // Check if a private chat already exists
//            var existingChat = await _applicationDbContext.Chats
//                .Where(c => !c.IsGroup &&
//                            c.Members.Any(m => m.Id == userId1) &&
//                            c.Members.Any(m => m.Id == userId2))
//                .FirstOrDefaultAsync();

//            if (existingChat != null)
//            {
//                return new OkObjectResult(new { message = "Chat already exists", chat = existingChat });
//            }

//            // If no chat exists, create a new one
//            var user1 = await _applicationDbContext.Users.FindAsync(userId1);
//            var user2 = await _applicationDbContext.Users.FindAsync(userId2);

//            if (user1 == null || user2 == null)
//            {
//                return new NotFoundObjectResult("One or both users not found.");
//            }

//            var newChat = new Chat
//            {
//                IsGroup = false,
//                Members = new List<ApplicationUser> { user1, user2 }
//            };

//            _applicationDbContext.Chats.Add(newChat);
//            await _applicationDbContext.SaveChangesAsync();

//            return new OkObjectResult(new { message = "Private chat created", chat = newChat });
//        }

//        // Create a new group chat
//        public async Task<IActionResult> CreateGroupChat(List<string> userIds, string chatName)
//        {
//            var users = await _applicationDbContext.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

//            if (users.Count != userIds.Count)
//            {
//                return new BadRequestObjectResult("Some users not found.");
//            }

//            var newChat = new Chat
//            {
//                IsGroup = true,
//                Admins = new List<ApplicationUser> { users.First() }, // Assuming first user is the admin
//                Members = users
//            };

//            _applicationDbContext.Chats.Add(newChat);
//            await _applicationDbContext.SaveChangesAsync();

//            return new OkObjectResult(new { message = "Group chat created", chat = newChat });
//        }
//    }
//}
