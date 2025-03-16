using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

public class ApplicationUser : IdentityUser
{
    public string? Bio { get; set; }
    
    public string? ProfilePic { get; set; }

    // Navigation properties
    public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public virtual ICollection<Chat> Chats { get; set; } = new List<Chat>();
}
