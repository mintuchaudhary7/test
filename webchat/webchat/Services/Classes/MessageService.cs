using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using webchat.Services.Interfaces;


namespace webchat.Services.Classes
{
    public class MessageService : IMessageService
    {
        
        private readonly ApplicationDbContext _applicationDbContext;
        public MessageService( ApplicationDbContext applicationDbContext)
        {
            
            _applicationDbContext = applicationDbContext;
        }

        public async Task<IActionResult> SendMessage(Message message, ModelStateDictionary modelState)
        {
            if (!modelState.IsValid)
            {
                return new BadRequestObjectResult(modelState);
            }

            var newMessage = new Message
            {
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                Timestamp = DateTime.UtcNow
            };

            var existingChat = await _applicationDbContext.Chats
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Members.Any(m => m.Id == message.SenderId) && c.Members.Any(m => m.Id == message.ReceiverId));

            // If no existing chat is found, create a new one
            if (existingChat == null)
            {
                existingChat = new Chat
                {
                    IsGroup = false,
                    Members = new List<ApplicationUser>
            {
                await _applicationDbContext.Users.FindAsync(message.SenderId),
                await _applicationDbContext.Users.FindAsync(message.ReceiverId)
            }
                };

                await _applicationDbContext.Chats.AddAsync(existingChat);
            }

            // Add the message to the chat
            existingChat.Messages.Add(newMessage);

            try
            {
                // Save the message and the chat (if a new one was created)
                await _applicationDbContext.Messages.AddAsync(newMessage);
                await _applicationDbContext.SaveChangesAsync();

                // Return only essential information
                return new OkObjectResult(new
                {
                    Message = "Message sent successfully",
                    Data = new
                    {
                        newMessage.MessageId,
                        newMessage.Content,
                        Timestamp = newMessage.Timestamp,
                        Sender = new
                        {
                            newMessage.Sender.UserName,       // Just the username
                            newMessage.Sender.ProfilePic      // And the profile picture (if needed)
                        },
                        Receiver = new
                        {
                            newMessage.Receiver.UserName,     // Same for the receiver
                            newMessage.Receiver.ProfilePic
                        }
                    }
                });
            }
            catch (Exception e)
            {
                return new BadRequestObjectResult(new { Error = "Failed to send message", Details = e.Message });
            }
        }



        public async Task<IActionResult> GetMessageByUserID(string UserId)
        {
            var messages = await _applicationDbContext.Messages
                .Where(m => m.SenderId == UserId || m.ReceiverId == UserId)
                .ToListAsync();


            if (messages.Count == 0)
            {
                return new NotFoundObjectResult("No messages found for this user.");
            }


            return new OkObjectResult(new { Data = messages });
        }
    }
}
