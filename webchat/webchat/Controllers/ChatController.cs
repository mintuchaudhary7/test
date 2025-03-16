using Microsoft.AspNetCore.Mvc;
using webchat.Services.Interfaces;

namespace webchat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("getAllChatsByChatId/{chatId}")]
        public async Task<IActionResult> GetChatByChatId(string chatId)
        {
            var result = await  _chatService.GetChatByChatId( chatId);

            return result;
        }

        [HttpGet("checkExistingChat/{userId}/{searchedUserId}")]
        public async Task<IActionResult> CheckExistingChat(string userId, string searchedUserId)
        {
            // Logic to check if the chat exists between the two users
            var result = await _chatService.CheckChatExists(userId, searchedUserId);

            return result;
        }

        [HttpPost("CreatePrivateChat")]

        public async Task<IActionResult> CreatePrivateChat( string userId1, string userId2)
        {
            var result = await  _chatService.CreatePrivateChat(userId1, userId2);
            return result;
        }
    }
}
