using Microsoft.AspNetCore.Mvc;

namespace webchat.Services.Interfaces
{
    public interface IChatService
    {
        public Task<IActionResult> GetChatByChatId(string chatId);

        public Task<IActionResult> CreatePrivateChat(string userId1, string userId2);
        public Task<IActionResult> CreateGroupChat(List<string> userIds, string chatName);

        public Task<IActionResult> CheckChatExists(string userId1, string userId2);
    }
}
