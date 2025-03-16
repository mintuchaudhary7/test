import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/context";
import profilepic from '../assets/Images/profilePic.png';
import MessageDashboard from "./MessageDashboard";

interface ViewChatsProps {
  selectedChat: any;
}

interface Message {
  content: string;
  messageId: string;
  senderName: string;
  recieverName: string;
  timestamp: string;
}

interface Group {
  chatId: string;
  isGroup: boolean;
  messages: Message[];
}

const ViewChats: React.FC<ViewChatsProps> = ({ selectedChat }) => {
  const [group, setGroup] = useState<Group>({
    chatId: "",
    isGroup: false,
    messages: [],
  });
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const profileName = userData.userName;

  console.log("kkk", selectedChat);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessageHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    const senderId = userData.id;
    const recieverId = selectedChat.members[1].id;

    if (!recieverId) {
      console.error("Receiver ID not found");
      return;
    }

    const newMessage: Message = {
      content: messageContent,
      messageId: Math.random().toString(36).substring(7),
      senderName: userData.userName,
      recieverName:
        selectedChat.members.find((member: any) => member.id === recieverId)
          ?.userName || "",
      timestamp: new Date().toISOString(),
    };

    setGroup((prevGroup) => ({
      ...prevGroup,
      messages: [...prevGroup.messages, newMessage],
    }));

    try {
      const response = await axios.post(
        "https://localhost:7145/api/Message/sendMessage",
        {
          senderId,
          receiverId: recieverId,
          content: messageContent,
        }
      );

      console.log(response);

      // Update the message list with the server's response
      setGroup((prevGroup) => ({
        ...prevGroup,
        messages: prevGroup.messages.map((msg) =>
          msg.messageId === newMessage.messageId
            ? { ...msg, messageId: response.data.messageId }
            : msg
        ),
      }));

      setMessageContent(""); // Clear the message input field after sending
    } catch (error) {
      console.error("An error occurred while sending the message", error);
    }
  };

  // Fetch all chat messages
  const getAllChat = async (id: string) => {
    try {
      const response = await axios.get(
        `https://localhost:7145/api/Chat/getAllChatsByChatId/${id}`
      );
      setGroup(response.data[0]);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message, "An error occurred while retrieving chats");
      } else {
        console.log("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    if (selectedChat && selectedChat.chatId) {
      getAllChat(selectedChat.chatId);
    }
  }, [selectedChat]);

  // Scroll to the bottom when messages are updated
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [group.messages]);

  // Convert UTC timestamp to IST
 const formatTimeToIST = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, 
      timeZone: "Asia/Kolkata",
    });
  };

  const sortedMessages = group.messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="bg-gray-900 h-screen text-white flex flex-col justify-between">
      {/* Chat Header */}
      <div className="h-16 bg-gray-800 flex items-center px-4 shadow-md">
        {selectedChat ? (
          <>
            {/* Get Recipient Info */}
            {selectedChat.members
              .filter((m: any) => m.id !== userData.id)
              .map((recipient: any) => (
                <div key={recipient.id} className="flex items-center gap-3">
                  {/* Profile Picture */}
                  <img
                    src={recipient?.profilePic || profilepic}
                    alt={recipient.userName}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-md"
                  />
                  {/* Username */}
                  <h2 className="text-lg font-semibold text-white">
                    {recipient.userName}
                  </h2>
                </div>
              ))}
          </>
        ) : (
          <p className="text-lg text-gray-400">
            Select a chat to start messaging
          </p>
        )}
      </div>

      {/* Messages Section */}
      <div className="flex-grow overflow-y-auto p-4">
        {sortedMessages.length > 0 ? (
          <div className="space-y-4">
            {sortedMessages.map((message) => (
              <div
                key={message.messageId}
                className={`flex flex-col ${
                  message.senderName === userData.userName
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div className="flex items-center">
                  <span className="font-semibold text-sm">
                    {message.senderName}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {formatTimeToIST(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg shadow-md text-white ${
                    message.senderName === userData.userName
                      ? "bg-gradient-to-r from-blue-500 to-blue-700"
                      : "bg-gray-700"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MessageDashboard />
        )}
        {/* Auto-scroll to bottom */}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input Field */}
      {!loading && (
        <div className="px-4 py-3 bg-gray-800 shadow-md">
          <form
            onSubmit={sendMessageHandler}
            className="flex items-center gap-3"
          >
            <input
              className="flex-1 p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && messageContent.trim()) {
                  sendMessageHandler(e);
                }
              }}
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewChats;

// import axios from "axios";
// import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/context";
// import MessageDashboard from "./MessageDashboard";

// interface ViewChatsProps {
//   selectedChat: any;
// }

// interface Message {
//   content: string;
//   messageId: string;
//   senderName: string;
//   recieverName: string;
//   timestamp: string;
// }

// interface Group {
//   chatId: string;
//   isGroup: boolean;
//   messages: Message[];
// }

// const ViewChats: React.FC<ViewChatsProps> = ({ selectedChat }) => {
//   const [group, setGroup] = useState<Group>({ chatId: "", isGroup: false, messages: [] });
//   const [messageContent, setMessageContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const { userData } = useAuth();
//   const profileName = userData.userName;

//   console.log("kkk",selectedChat)

//   const messageEndRef = useRef<HTMLDivElement | null>(null);

//   const sendMessageHandler = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!messageContent.trim()) return;

//     const senderId = userData.id;
//     const recieverId = selectedChat.members[1].id;

//     if (!recieverId) {
//       console.error("Receiver ID not found");
//       return;
//     }

//     const newMessage: Message = {
//       content: messageContent,
//       messageId: Math.random().toString(36).substring(7),
//       senderName: userData.userName,
//       recieverName: selectedChat.members.find((member: any) => member.id === recieverId)?.userName || '',
//       timestamp: new Date().toISOString(),
//     };

//     setGroup((prevGroup) => ({
//       ...prevGroup,
//       messages: [...prevGroup.messages, newMessage],
//     }));

//     try {
//       const response = await axios.post("https://localhost:7145/api/Message/sendMessage", {
//         senderId,
//         receiverId: recieverId,
//         content: messageContent,
//       });

//       console.log(response)

//       // Update the message list with the server's response
//       setGroup((prevGroup) => ({
//         ...prevGroup,
//         messages: prevGroup.messages.map((msg) =>
//           msg.messageId === newMessage.messageId ? { ...msg, messageId: response.data.messageId } : msg
//         ),
//       }));

//       setMessageContent(""); // Clear the message input field after sending
//     } catch (error) {
//       console.error("An error occurred while sending the message", error);
//     }
//   };

//   // Fetch all chat messages
//   const getAllChat = async (id: string) => {
//     try {
//       const response = await axios.get(`https://localhost:7145/api/Chat/getAllChatsByChatId/${id}`);
//       setGroup(response.data[0]);
//       setLoading(false); // Set loading to false after data is fetched
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.log(error.message, "An error occurred while retrieving chats");
//       } else {
//         console.log("An unknown error occurred");
//       }
//     }
//   };

//   useEffect(() => {
//     if (selectedChat && selectedChat.chatId) {
//       getAllChat(selectedChat.chatId);
//     }
//   }, [selectedChat]);

//   // Scroll to the bottom when messages are updated
//   useEffect(() => {
//     if (messageEndRef.current) {
//       messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [group.messages]);

//   // Convert UTC timestamp to IST
//   const formatTimeToIST = (timestamp: string) => {
//     return new Date(timestamp).toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//       timeZone: "Asia/Kolkata",
//     });
//   };

//   const sortedMessages = group.messages.sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

//   return (
//     <div className="bg-blue-700 h-screen text-white flex flex-col justify-between">

//       <div className="h-2/15 bg-gray-400">
//         {selectedChat ? (
//           <div>
//             <h2 className="text-xl font-semibold">Chat ID: {selectedChat.chatId}</h2>
//             <h3 className="text-lg mt-2 font-semibold">Members:</h3>
//             <ul className="list-disc pl-5 mt-2">
//               {selectedChat.members.map((member: any) => (
//                 <li key={member.id} className="text-md">{member.userName}</li>

//               ))}
//             </ul>
//           </div>
//         ) : (
//           <p className="text-lg mt-4">Select a chat to view its details</p>
//         )}
//       </div>

//       {/* Display Sorted Messages */}
//       <div className="flex-grow overflow-y-auto p-4">
//         {sortedMessages.length > 0 ? (
//           <div className="space-y-4">
//             {sortedMessages.map((message) => (
//               <div
//                 key={message.messageId}
//                 className={`flex flex-col ${message.senderName === userData.userName ? "items-end" : "items-start"}`}
//               >
//                 <div className="flex items-center">
//                   <span className="font-semibold text-sm">{message.senderName}</span>
//                   <span className="text-xs text-gray-400 ml-2">
//                     {formatTimeToIST(message.timestamp)}
//                   </span>
//                 </div>
//                 <div
//                   className={`bg-white text-black p-3 rounded-lg shadow-md ${
//                     message.senderName === selectedChat.userName ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   <p>{message.content}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           // <div>
//           //   <p className="flex items-center justify-center">No messages yet.</p>
//           // </div>
//           <MessageDashboard />
//         )}
//         {/* This div helps scroll to the bottom */}
//         <div ref={messageEndRef} />
//       </div>

//       {/* Show Message Input only after loading messages */}
//       {!loading && (
//         <div className="mb-4 px-4 py-2">
//           <form onSubmit={sendMessageHandler} className="flex items-center gap-2">
//             <input
//               className="bg-white text-black w-10/12 h-12 p-4 rounded-lg shadow-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               type="text"
//               value={messageContent}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageContent(e.target.value)}
//               placeholder="Type a message..."
//             />
//             <button
//               type="submit"
//               className="bg-black text-white font-bold w-2/12 h-12 rounded-lg hover:bg-gray-800 transition duration-200"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewChats;
