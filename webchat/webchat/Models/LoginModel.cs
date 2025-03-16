using System.ComponentModel.DataAnnotations;

namespace webchat.DTO.Models
{
    public class LoginModel
    {


        public string? Username { get; set; }


        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
