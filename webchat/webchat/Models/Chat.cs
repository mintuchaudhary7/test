using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Chat
{
    [Key]
    public Guid GroupId { get; set; } = Guid.NewGuid();
    public bool IsGroup { get; set; }
    //public string ChatName { get; set; }

    // Admins of the group
    [JsonIgnore]
    public virtual ICollection<ApplicationUser> Admins { get; set; } = new List<ApplicationUser>();

    // Messages in the chat
    [JsonIgnore]
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    // Members of the group
    [JsonIgnore]
    public virtual ICollection<ApplicationUser> Members { get; set; } = new List<ApplicationUser>();
}
