import React from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiUserPlus, FiShield } from "react-icons/fi"; // Icons for chat & security

const LandingPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1E1E2E] via-[#312E81] to-[#6D28D9] text-white px-6">
      
      {/* Main Container */}
      <div className="max-w-3xl p-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl text-center border border-white border-opacity-20 animate-fade-in">
        
        {/* Title with Chat Icon */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 flex items-center justify-center gap-3 drop-shadow-lg">
          <FiMessageSquare className="text-cyan-300" /> ChatSphere
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl opacity-90 mb-8 font-light tracking-wide">
          Stay connected with your friends, family, and colleagues in real-time.  
          <br /> Fast, secure, and beautifully designed chat experience.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <FiUserPlus className="text-cyan-300 text-2xl" />
            <p className="text-gray-300 text-lg">Easy Sign-Up</p>
          </div>
          <div className="flex items-center gap-3">
            <FiMessageSquare className="text-purple-300 text-2xl" />
            <p className="text-gray-300 text-lg">Instant Messaging</p>
          </div>
          <div className="flex items-center gap-3">
            <FiMessageSquare className="text-pink-400 text-2xl" />
            <p className="text-gray-300 text-lg">Group Chats</p>
          </div>
          <div className="flex items-center gap-3">
            <FiShield className="text-yellow-300 text-2xl" />
            <p className="text-gray-300 text-lg">End-to-End Encryption</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link
            to="/signup"
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-400 flex items-center gap-2"
          >
            <FiUserPlus /> Sign Up
          </Link>
          <Link
            to="/login"
            className="border-2 border-gray-400 py-3 px-8 rounded-lg font-semibold transition-all hover:bg-gray-300 hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-gray-500 flex items-center gap-2"
          >
            <FiMessageSquare /> Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
