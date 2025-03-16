using Microsoft.AspNetCore.Mvc;
using webchat.Services.Interfaces;

namespace webchat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            var result = await _messageService.SendMessage(message, ModelState);
            return result;
        }

        [HttpGet("getMessageByUserID/{id}")]
        public async Task<IActionResult> GetMessageByUserID(string id)
        {
            var result = await _messageService.GetMessageByUserID(id);
            return result;
        }

    }
}


//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using webchat.Services.Interfaces;

//namespace webchat.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class MessageController : ControllerBase
//    {
//        private readonly ApplicationDbContext applicationDbContext;

//        public MessageController(ApplicationDbContext applicationDbContext)
//        {
//            this.applicationDbContext = applicationDbContext;
//        }

//        [HttpPost("sendMessage")]
//        public async Task<IActionResult> SendMessage([FromBody] Message message)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);

//            }

//            var newMessage = new Message
//            {
//                SenderId = message.SenderId,
//                ReceiverId = message.ReceiverId,
//                Content = message.Content,

//            };

//            try
//            {
//                await applicationDbContext.Messages.AddAsync(newMessage);
//                await applicationDbContext.SaveChangesAsync();

//                return Ok(new { Message = "Message sent successfully", Data = newMessage });

//            }
//            catch (Exception e)
//            {
//                return BadRequest(new { Error = "Failed to send message", Details = e.Message });
//            }          
//        }

//        [HttpGet("getMessageByUserID/{id}")]
//        public async Task<IActionResult> GetMessageByUserID(string id)
//        {

//            var messages = await applicationDbContext.Messages
//                .Where(m => m.SenderId == id || m.ReceiverId == id)
//                .ToListAsync();


//            if (messages.Count == 0)
//            {
//                return NotFound("No messages found for this user.");
//            }


//            return Ok(new { Data = messages });
//        }

//    }
//}





//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore; // Required for asynchronous database operations
//using System.Threading.Tasks;

//namespace webchat.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class MessageController : ControllerBase
//    {
//        private readonly ApplicationDbContext _applicationDbContext;

//        // Constructor to inject ApplicationDbContext
//        public MessageController(ApplicationDbContext applicationDbContext)
//        {
//            _applicationDbContext = applicationDbContext;
//        }

//        // POST: api/message/sendMessage
//        [HttpPost("sendMessage")]
//        public async Task<IActionResult> SendMessage([FromBody] Message message)
//        {
//            // Check if the model is valid
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState); // Return BadRequest if the model is not valid
//            }

//            // Create a new message object
//            var newMessage = new Message
//            {
//                SenderId = message.SenderId,
//                ReceiverId = message.ReceiverId,
//                Content = message.Content,
//            };

//            try
//            {
//                // Add the message to the database asynchronously
//                await _applicationDbContext.Messages.AddAsync(newMessage);

//                // Save changes to the database asynchronously
//                await _applicationDbContext.SaveChangesAsync();

//                // Return a success response with the created message
//                return Ok(new { Message = "Message sent successfully", Data = newMessage });
//            }
//            catch (Exception ex)
//            {
//                // In case of an error, return a BadRequest with the error message
//                return BadRequest(new { Error = "Failed to send message", Details = ex.Message });
//            }
//        }
//    }
//}
