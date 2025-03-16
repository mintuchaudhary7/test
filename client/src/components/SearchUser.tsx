import { useState, useEffect } from "react";
import { useAuth } from "../context/context";
import axios from "axios"; // Ensure axios is installed
import profilepic from '../assets/Images/profilePic.png';

interface SearchUserProps {
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

const SearchUser: React.FC<SearchUserProps> = ({ setSelectedChat }) => {
  const [searchUser, setSearchUser] = useState<string>(""); // Store the search input
  const [searchResults, setSearchResults] = useState<Members | null>(null); // Store user details from search
  const [isSearching, setIsSearching] = useState<boolean>(false); // Show searching status
  const { userData, } = useAuth(); // Access logged-in user data
 // const [existingChat, setExistingChat] = useState<any>(null); // Store existing chat if found

  useEffect(() => {
    // Search for users based on entered username
    const searchUsers = async () => {
      if (searchUser.trim()) {
        setIsSearching(true);
        try {
          const response = await axios.get(`https://localhost:7145/api/User/SearchUserByUsername/${searchUser}`);
          if (response.data && response.data.user) {
            setSearchResults(response.data.user); // Set the user details if found
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null); // Clear results if search input is empty
      }
    };

    // Debounce to delay the API call if the user stops typing
    const timeoutId = setTimeout(searchUsers, 500);

    return () => clearTimeout(timeoutId); // Cleanup the timeout
  }, [searchUser]); // Effect runs when searchUser changes

  // Function to check for an existing chat and set selected chat immediately
  const checkExistingChatAndSetSelected = async (searchedUserId: string) => {
    try {
      const response = await axios.get(
        `https://localhost:7145/api/Chat/CheckExistingChat/${userData.id}/${searchedUserId}`
      );

      if (response.data.exists) {
        //setExistingChat(response.data.chat); // Set the existing chat if found
        const chatId = response.data.chat.groupId; // Assuming `groupId` is the identifier for the chat

        // Fetch the chat's messages immediately after checking
        const chatResponse = await axios.get(`https://localhost:7145/api/Chat/getAllChatsByChatId/${chatId}`);
        setSelectedChat(chatResponse.data[0]);
        //console.log("in serach", existingChat)
      } else {
        //setExistingChat(null); // No existing chat found
        setSelectedChat(null); // Clear the selected chat if no chat exists
      }
    } catch (error) {
      console.error("Error checking for existing chat:", error);
    }
  };

  // Handle the click event when a user is selected from the search results
  const handleInitiateChat = async () => {
    if (searchResults) {
      await checkExistingChatAndSetSelected(searchResults.id); // This will check for the existing chat and set selected chat in one click
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Search Input Field */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-2">
        <input
          className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchUser}
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
          placeholder="Search for a user..."
        />
      </form>
  
      {/* Search Results */}
      {searchUser && (
        <div className="bg-white p-3 rounded-lg shadow-md">
          {isSearching ? (
            <p className="text-gray-500 text-center">🔍 Searching...</p>
          ) : searchResults ? (
            <div
              key={searchResults.id}
              className="flex items-center gap-x-4 p-3 bg-gray-200 rounded-md cursor-pointer hover:bg-blue-300 transition-all duration-200 shadow-sm"
              onClick={handleInitiateChat}
            >
              <img
                className="w-12 h-12 rounded-full border-2 border-gray-400 shadow-md"
                src={searchResults.profilePic ? searchResults.profilePic : profilepic}
                alt={searchResults.userName}
              />
              <p className="text-lg font-semibold text-gray-800">{searchResults.userName}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No user found 😞</p>
          )}
        </div>
      )}
    </div>
  );
  
};

export default SearchUser;



// import { useState, useEffect } from "react";
// import { useAuth } from "../context/context";
// import axios from "axios"; // Make sure axios is installed
// import profilepic from '../assets/Images/profilePic.png';

// interface Members {
//     id: string;
//     userName: string;
//     profilePic: string | null;
// }

// interface SearchResponse {
//   data: {
//     message: string;
//     user: Members; // The user data is inside the 'user' object
//   };
// }

// const SearchUser: React.FC = () => {
//     const [searchUser, setSearchUser] = useState<string>("");
//     const [searchResults, setSearchResults] = useState<Members | null>(null); // Single user or null
//     const [isSearching, setIsSearching] = useState<boolean>(false);

//     const { userData } = useAuth();
//     let recieverId = "";

//     useEffect(() => {
//         const searchUsers = async () => {
//             if (searchUser.trim()) {
//                 setIsSearching(true);
//                 try {
//                     // Sending the searchUser as part of the URL path
//                     const response = await axios.get(`https://localhost:7145/api/User/SearchUserByUsername/${searchUser}`);
//                     console.log(response);
//                     // Accessing the 'user' property from the API response
//                     if (response.data && response.data.user) {
//                         setSearchResults(response.data.user);
//                     }
//                 } catch (error) {
//                     console.error("Error fetching search results:", error);
//                 } finally {
//                     setIsSearching(false);
//                 }
//             } else {
//                 setSearchResults(null);
//             }
//         };

//         // Delay the API call if the user stops typing (Debounce logic)
//         const timeoutId = setTimeout(searchUsers, 500); // Delay the API call by 500ms

//         // Cleanup the timeout to avoid unnecessary calls when the user types too fast
//         return () => clearTimeout(timeoutId);
//     }, [searchUser]); // Effect runs when searchUser changes

//     // Function to initiate the chat
//     async function handleInitiateChat() {
//         const senderId = userData.id; // Ensure that this value is available

//         // Check if searchResults is not null and extract recieverId
//         if (searchResults) {
//             recieverId = searchResults.id;
//         } else {
//             console.log("Receiver not selected or missing!");
//             return;
//         }

//         console.log("Initiating chat with:", senderId, recieverId);

//         const result = await axios.post("https://localhost:7145/api/Message/sendMessage", {
//             senderId,
//             receiverId: recieverId,
//             content: "u", // Adjust the content as necessary
//         });
//         console.log(result);
//     }

//     return (
//         <div>
//             <form onSubmit={(e) => e.preventDefault()} className="my-2">
//                 <input
//                     className="bg-white text-black w-full h-10 rounded-md"
//                     value={searchUser}
//                     type="text"
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
//                     placeholder="Search User"
//                 />
//             </form>

//             {/* Display search results */}
//             {searchUser && (
//                 <div className="search-results">
//                     {isSearching ? (
//                         <p>Searching...</p> // Show loading message while searching
//                     ) : searchResults ? (
//                         <div
//                             key={searchResults.id}
//                             className="flex items-center pl-3 gap-x-4 bg-gray-200 h-18 rounded-md cursor-pointer"
//                             onClick={handleInitiateChat} // Fix here: call the function correctly
//                         >
//                             <img
//                                 className="rounded-full h-15 w-15"
//                                 src={searchResults.profilePic ? searchResults.profilePic : profilepic}
//                                 alt={searchResults.userName}
//                             />
//                             <p>{searchResults.userName}</p>
//                         </div>
//                     ) : (
//                         <p>No user found</p> // Handle case where no results were found
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SearchUser;


