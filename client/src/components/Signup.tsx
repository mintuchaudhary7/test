import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "", username: "", confirmPassword: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = (data: any) => {
        const errors = { email: "", password: "", username: "", confirmPassword: "" };

        if (!data.username.trim()) {
            errors.username = "username is required"
        }

        if (!data.email.trim()) {
            errors.email = "Email is required"
        } else if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.password.trim()) {
            errors.password = "Password is required";
        } else if (data.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(data.password)) {
            errors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(data.password)) {
            errors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(data.password)) {
            errors.password = "Password must contain at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
            errors.password = "Password must contain at least one special character";
        }

        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "Password and Confirm Password must be same"
        }
        return errors
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;
    
        // Validate the form
        const newErrors = validateForm(formData);
        setErrors(newErrors);
    
        // If validation passes, make the API request
        if (Object.values(newErrors).every((error) => error === "")) {
            try {
                const response = await axios.post("https://localhost:7145/api/Account/register", {
                    username,
                    email,
                    password,
                    confirmPassword,
                });
    
                
                toast.success("Signup successful!");
                navigate("/login"); 
                console.log(response);
            } catch (error: any) {
                // Handle error
                if (error.response) {
                    // Check if error is from backend
                    const errorMessage = error.response.data.message || "An error occurred while signing up.";
                    toast.error(errorMessage); // Show error toast notification
                    console.log("Error:", error.response.data);
                    //toast.error(error.response.data);
                } else {
                    // If no response from backend (network error, etc.)
                    console.log("Error:", error);
                    toast.error(error);
                }
            }
        } else {
            console.log('Form submission failed due to validation errors.');
        }
    }
    

    return (
        <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-screen flex items-center justify-center">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg space-y-6">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
                <form noValidate onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="flex flex-col">
                        <label htmlFor="username" className="text-gray-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col relative">
                        <label htmlFor="password" className="text-gray-700 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <div className="flex flex-col relative">
                        <label htmlFor="confirmPassword" className="text-gray-700 font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2"
                        >
                            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
