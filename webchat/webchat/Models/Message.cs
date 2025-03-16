using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Message
{
    [Key]
    public Guid MessageId { get; set; } = Guid.NewGuid();

    [Required]
    [ForeignKey("Sender")]
    public string SenderId { get; set; }
    [JsonIgnore]
    public virtual ApplicationUser? Sender { get; set; }

    [Required]
    [ForeignKey("Receiver")]
    public string ReceiverId { get; set; }
   [JsonIgnore]
    public virtual ApplicationUser? Receiver { get; set; }
     
    [Required]
    public string Content { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
