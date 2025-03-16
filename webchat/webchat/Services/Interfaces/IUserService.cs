using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace webchat.Services.Interfaces
{
    public interface IUserService
    {
        public Task<IActionResult> GetUserInfo(string UserId);

        public Task<IActionResult> SesrchUserByUsername(string UserName);

        public Task<IActionResult> UpdateUserBio( string bio, string userId);
    }
}
