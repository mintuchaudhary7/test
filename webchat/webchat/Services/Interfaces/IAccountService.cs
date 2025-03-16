using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using webchat.DTO.Models;

namespace webchat.Services.Interfaces
{
    public interface IAccountService
    {
        public Task<IActionResult> RegisterAsync(RegisterModel model, ModelStateDictionary modelState);
        public Task<IActionResult> LoginAsync(LoginModel model, ModelStateDictionary modelState);
        string GenerateJwtToken(ApplicationUser user);
    }
}
