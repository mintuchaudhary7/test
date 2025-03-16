using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace webchat.Services.Interfaces
{
    public interface IMessageService
    {
        public Task<IActionResult> SendMessage(Message message, ModelStateDictionary modelState);
        public Task<IActionResult> GetMessageByUserID(string UserId);
    }
}
