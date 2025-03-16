import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ViewChats from "./ViewChat";
import ShowUserInfo from "./ShowUserInfo";
import SearchUser from "./SearchUser"

const HomePage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);

  return (
    <div className="w-full h-screen flex bg-gray-200">


      <div className="w-1/4 lg:w-2/7 bg-gray-800 text-white p-3 flex flex-col">

        <ShowUserInfo />
        <SearchUser setSelectedChat={setSelectedChat} />

        <div className="flex-grow overflow-y-auto mt-1">
          <Sidebar setSelectedChat={setSelectedChat} />
        </div>
      </div>


      <div className="flex-1 bg-gray-100 p-1">
        <ViewChats selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default HomePage;

// // Example interface for a conversation
// interface Conversation {
//     id: number;
//     name: string;
//     lastMessage: string;
//     timestamp: string;
// }

// const HomePage: React.FC = () => {
//     const {userData} = useAuth();

//     const user = {
//         username: "JohnDoe",
//         profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
//     };


//     const conversations: Conversation[] = [
//         {
//             id: 1,
//             name: "Jane Smith",
//             lastMessage: "Hey, how are you?",
//             timestamp: "2:30 PM",
//         },
//         {
//             id: 2,
//             name: "Mike Johnson",
//             lastMessage: "Let's catch up later!",
//             timestamp: "12:15 PM",
//         },
//         {
//             id: 3,
//             name: "Anna Lee",
//             lastMessage: "Can you send the file?",
//             timestamp: "9:00 AM",
//         },
//     ];

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Sidebar */}
//             <div className="w-64 bg-white border-r border-gray-300 p-4">
//                 <div className="flex items-center space-x-3">
//                     <img
//                         src={userData.ProfilePic}
//                         alt="Profile"
//                         className="w-12 h-12 rounded-full"
//                     />
//                     <span className="font-semibold text-xl">{userData.userName}</span>
//                 </div>



//                 {/* <nav className="mt-8">
//                     <Link
//                         to="/profile"
//                         className="text-gray-700 flex items-center space-x-2 hover:text-blue-500"
//                     >
//                         <FaUserCircle />
//                         <span>Profile</span>
//                     </Link>
//                     <button
//                         onClick={() => console.log("Log out clicked")}
//                         className="mt-4 text-gray-700 flex items-center space-x-2 hover:text-blue-500"
//                     >
//                         <FaSignOutAlt />
//                         <span>Log out</span>
//                     </button>
//                 </nav> */}

//                 <div className="mt-8">
//                     <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
//                     <ul className="mt-4">
//                         {conversations.map((conversation) => (
//                             <li
//                                 key={conversation.id}
//                                 className="flex items-center justify-between p-2 mt-2 rounded-lg hover:bg-gray-200 cursor-pointer"
//                             >
//                                 <div className="flex items-center space-x-3">
//                                     <img
//                                         src={`https://randomuser.me/api/portraits/men/${conversation.id}.jpg`}
//                                         alt={conversation.name}
//                                         className="w-10 h-10 rounded-full"
//                                     />
//                                     <div>
//                                         <p className="font-medium text-gray-800">{conversation.name}</p>
//                                         <p className="text-sm text-gray-500">{conversation.lastMessage}</p>
//                                     </div>
//                                 </div>
//                                 <span className="text-sm text-gray-500">{conversation.timestamp}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>

//             {/* Main Content Area */}
//             <div className="flex-1 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-semibold text-gray-800">Welcome to the Chat App!</h1>
//                     <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
//                         New Message
//                     </button>
//                 </div>

//                 <div className="bg-white p-4 rounded-lg shadow-lg">
//                     <h2 className="text-xl font-semibold text-gray-800">Select a Conversation</h2>
//                     <p className="text-gray-500 mt-2">Click on a conversation to start chatting.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };






