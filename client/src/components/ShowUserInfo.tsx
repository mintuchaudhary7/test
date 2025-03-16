import { useAuth } from "../context/context";
import profilepic from '../assets/Images/profilePic.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Import icons for dropdown

const ShowUserInfo: React.FC = () => {
    const { userData, logout } = useAuth();
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged Out Successfully");
    };

    return (
        <div className="flex flex-col items-center p-4">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* Profile Section */}
            <div
                className="bg-yellow-500 w-full py-4 flex justify-between items-center px-6 rounded-lg shadow-md cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
            >
                <div className="flex items-center gap-4">
                    <img
                        className="rounded-full h-16 w-16 border-2 border-black hover:ring-4 hover:ring-blue-400 transition duration-300"
                        src={userData.profilePic || profilepic}
                        alt="Profile"
                    />
                    <p className="font-semibold text-2xl text-black">{userData.userName}</p>
                </div>
                {/* Toggle Arrow */}
                {showOptions ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
            </div>

            {/* Profile Options - Dropdown */}
            {showOptions && (
                <div className="bg-gray-200 w-full py-4 flex flex-col items-center gap-3 mt-2 rounded-lg shadow-lg transition-all duration-300">
                    <button
                        onClick={() => navigate("/updateUserInfo")}
                        className="w-5/6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        View Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-5/6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShowUserInfo;
