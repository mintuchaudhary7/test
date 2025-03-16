import { IoChatbubbleEllipsesOutline } from "react-icons/io5"; // Import chat icon




const MessageDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600">
      <IoChatbubbleEllipsesOutline className="text-6xl text-gray-400 mb-3" />
      <p className="text-lg font-semibold">No messages yet.</p>
      <p className="text-sm text-gray-500">Start a conversation now!</p>
    </div>
  );
};

export default MessageDashboard;
