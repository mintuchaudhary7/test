import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../context/context';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { email, password } = formData;
        try {
            const response = await axios.post("https://localhost:7145/api/Account/login", {
                email,
                password,
            });

            const token = response.data.token;
            login(token);

            navigate('/');
            toast.success("Login successful!!!");

        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || "Login failed, please check your credentials.");
            } else {
                toast.error("An unknown error occurred while logging in.");
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] px-4">
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="relative w-full max-w-md p-8 rounded-xl bg-opacity-10 backdrop-blur-lg border border-gray-700 shadow-2xl">
                
                {/* Floating Glow Effect */}
                <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-500 opacity-40 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-blue-400 opacity-40 blur-3xl rounded-full"></div>

                {/* Login Title */}
                <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back 👋</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-300 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-500 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col relative">
                        <label htmlFor="password" className="text-gray-300 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="p-4 border border-gray-500 bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                        >
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-md hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login: React.FC = () => {
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [errors, setErrors] = useState({ email: "", password: "" });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const validateForm = (data: any) => {
//         const errors = { email: "", password: "" };

//         if (!data.email.trim()) {
//             errors.email = "Email is required";
//         } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
//             errors.email = "Email is invalid";
//         }

//         if (!data.password.trim()) {
//             errors.password = "Password is required";
//         }

//         return errors;
//     };

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         const { email, password } = formData;
//         const newErrors = validateForm(formData);
//         setErrors(newErrors);

//         if (!newErrors.email && !newErrors.password) {
//             try {
//                 const response = await axios.post("https://localhost:7145/api/Account/login", {
//                     email,
//                     password,
//                 });
//                 console.log(response);
//             } catch (error: unknown) {
//                 if (error instanceof Error) {
//                     console.log(error.message, "An error occurred while logging in");
//                 } else {
//                     console.log("An unknown error occurred");
//                 }
//             }
//         }

//         console.log("Form Submitted", formData);
//     }

//     return (
//         <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 min-h-screen flex items-center justify-center">
//             <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg space-y-6">
//                 <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Email Field */}
//                     <div className="flex flex-col">
//                         <label htmlFor="email" className="text-gray-700 font-medium mb-2">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//                     </div>

//                     {/* Password Field */}
//                     <div className="flex flex-col relative">
//                         <label htmlFor="password" className="text-gray-700 font-medium mb-2">
//                             Password
//                         </label>
//                         <input
//                             type={passwordVisible ? "text" : "password"}
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             className="p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setPasswordVisible(!passwordVisible)}
//                             className="absolute top-1/2 right-4 transform -translate-y-1/2"
//                         >
//                             {passwordVisible ? <FaEyeSlash /> : <FaEye />}
//                         </button>
//                     </div>
//                     {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

//                     <button
//                         type="submit"
//                         className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
//                     >
//                         Log In
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;
