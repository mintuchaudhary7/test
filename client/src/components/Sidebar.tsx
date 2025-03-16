import { useAuth } from "../context/context";
import profilepic from "../assets/Images/profilePic.png";

interface SidebarProps {
  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;
}

interface Members {
  id: string;
  userName: string;
  profilePic: string | null;
}

interface Message {
  content: string;
  messageId: string;
  senderName: string;
  recieverName: string;
  timestamp: string;
}

interface Chat {
  chatId: string;
  isGroup: boolean;
  members: Members[];
  messages: Message[];
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedChat }) => {
  const { userData } = useAuth();
  const profileName = userData.userName;
  const chats = userData.chats as Chat[];

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    console.log("Selected Chat:", chat);
  };

  // Function to format timestamp to readable format
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="sidebar overflow-x-hidden max-h-screen overflow-y-auto bg-gray-800 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Chats</h2>
      <ul>
        {chats.map((chat) => {
          const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

          return (
            <li className="m-1 list-none w-full" key={chat.chatId}>
              {chat.members
                .filter((member) => member.userName !== profileName)
                .map((member) => (
                  <div
                    onClick={() => handleChatClick(chat)}
                    className="flex items-center px-3 py-2 gap-x-4 bg-gray-700 rounded-md hover:bg-gray-600 transition duration-200 cursor-pointer"
                    key={member.id}
                  >
                    {/* Profile Picture */}
                    <img
                      className="rounded-full h-12 w-12 border-2 border-gray-500"
                      src={member.profilePic || profilepic}
                      alt={member.userName}
                    />
                    
                    {/* Chat Info */}
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{member.userName}</p>
                      <p className="text-gray-300 text-sm truncate">
                        {lastMessage ? (
                          <>
                            <span className="font-semibold">{lastMessage.senderName}</span> {lastMessage.content}
                          </>
                        ) : (
                          <span className="text-gray-400">No messages yet</span>
                        )}
                      </p>
                    </div>

                    {/* Timestamp */}
                    {lastMessage && (
                      <p className="text-gray-400 text-xs">{formatTime(lastMessage.timestamp)}</p>
                    )}
                  </div>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
