import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/context';

function Navbar() {
    const [isMobileView, setIsMobileView] = useState(false);
    const { isLogin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged Out Successfully");
        setIsMobileView(false); // Close mobile menu on logout
    };

    return (
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg">
            <ToastContainer position="top-center" autoClose={3000} />
            <nav className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Logo */}
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-white text-3xl font-extrabold tracking-wide hover:text-yellow-300 transition"
                    >
                        WebChat
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileView(!isMobileView)}
                        className="text-white focus:outline-none md:hidden"
                    >
                        {isMobileView ? <IoMdClose size={28} /> : <GiHamburgerMenu size={28} />}
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 text-white text-lg font-semibold">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive 
                                    ? "underline text-yellow-400" 
                                    : "hover:text-yellow-300 transition"
                            }
                        >
                            Home
                        </NavLink>

                        {isLogin ? (
                            <button
                                onClick={handleLogout}
                                className="hover:text-yellow-300 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <div className="flex space-x-6">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive 
                                            ? "underline text-yellow-400" 
                                            : "hover:text-yellow-300 transition"
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) =>
                                        isActive 
                                            ? "underline text-yellow-400" 
                                            : "hover:text-yellow-300 transition"
                                    }
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isMobileView ? "block" : "hidden"} md:hidden mt-4`}>
                    <ul className="space-y-6 text-white font-semibold text-center bg-gray-900 py-6 rounded-lg shadow-lg">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive 
                                        ? "underline text-yellow-400" 
                                        : "hover:text-yellow-300 transition"
                                }
                                onClick={() => setIsMobileView(false)}
                            >
                                Home
                            </NavLink>
                        </li>

                        {isLogin ? (
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className="text-white hover:text-yellow-300 transition"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive 
                                                ? "underline text-yellow-400" 
                                                : "hover:text-yellow-300 transition"
                                        }
                                        onClick={() => setIsMobileView(false)}
                                    >
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/signup"
                                        className={({ isActive }) =>
                                            isActive 
                                                ? "underline text-yellow-400" 
                                                : "hover:text-yellow-300 transition"
                                        }
                                        onClick={() => setIsMobileView(false)}
                                    >
                                        Sign Up
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
