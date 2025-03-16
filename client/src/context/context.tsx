import { createContext, useContext, ReactNode } from "react";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

// Update User interface to allow any string values for userName, ProfilePic, and Bio
interface User {
    id: string
    userName: string;
    email: string;
    profilePic: string;
    bio: string;
    chats: []
}

interface AuthContextType {
    isLogin: boolean;
    login: (token: string) => void;
    logout: () => void;
    role: string;
    userData: User;
}

interface Message {
    content: string;
    messageId: string;
    senderName: string;
    recieverName: string;
    timestamp: string;
  }

  interface AuthContextType {
    isLogin: boolean;
    login: (token: string) => void;
    logout: () => void;
    role: string;
    userData: User;
    message: Message; // Add message property
    setMessage: React.Dispatch<React.SetStateAction<Message>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [role, setRole] = useState<string>('');
    const [userData, setUserData] = useState<User>({id: "", userName: "", email: "", profilePic: "", bio: "", chats: []}); // Initial state with empty strings

    const [message, setMessage ] = useState<Message>({
        content: "",
        messageId: "",
        senderName: "",
        recieverName: "",
        timestamp: ""
    })


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogin(true);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLogin(false);
    };

    async function userInfo() {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        try {
            const response = await axios.get('https://localhost:7145/api/User/getData', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            setUserData(response.data.user);
            console.log("here",response.data.user);  
        } catch (error) {
            console.error("Error getting user info:", error);
        }
    }

    useEffect(() => {
        userInfo();
    }, [isLogin]);

    console.log(message, "nnn")

    return (
        <AuthContext.Provider value={{ isLogin, login, logout, role, userData, message, setMessage }}>
            {children}
        </AuthContext.Provider>
    );
};


// import { createContext, useContext, ReactNode } from "react";
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// interface User{userName:"", ProfilePic:"",Bio:""}

// interface AuthContextType {
//     isLogin: boolean;
//     login: (token: string) => void;
//     logout: () => void;
//     role: string;
//     userData: User
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };

// interface AuthProviderProps {
//     children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [isLogin, setIsLogin] = useState<boolean>(false);
//     const [role, setRole] = useState<string>('');
//     const [userData, setUserData] = useState({userName:"", ProfilePic:"",Bio:""});


//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             setIsLogin(true);
//         }
//     }, []);

//     const login = (token: string) => {
//         localStorage.setItem("token", token);
//         setIsLogin(true);
//     };


//     const logout = () => {
//         localStorage.removeItem("token");
//         setIsLogin(false);
//     };



//     async function userInfo() {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             return;
//         }
//         try {
//             const response = await axios.get('https://localhost:7145/api/User/getData', {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 }
//             });
           
//            setUserData(response.data.user);
//             console.log(userData.userName);        

//             console.log(response);
//             //setRole(response.data.result.role);
//         } catch (error) {
//             console.error("Error getting user info:", error);
//         }
//     }

//     useEffect(() => {
//         userInfo();
//         console.log("in dondgh", userData);
//     }, [isLogin]);

//     return (
//         <AuthContext.Provider value={{ isLogin, login, logout, role, userData }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };


// import { createContext, useContext, ReactNode } from "react";
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// interface User {
//   profilePic: string;
//   bio: string;
// }

// interface AuthContextType {
//   isLogin: boolean;
//   login: (token: string) => void;
//   logout: () => void;
//   role: string;
//   user: User | null; // User data (profilePic, bio, etc.)
//   setUser: (user: User) => void; // Method to set user info
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [isLogin, setIsLogin] = useState<boolean>(false);
//   const [role, setRole] = useState<string>('');
//   const [user, setUser] = useState<User | null>(null); // Store the user data here

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLogin(true);
//     }
//   }, []);

//   const login = (token: string) => {
//     localStorage.setItem("token", token);
//     setIsLogin(true);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setIsLogin(false);
//     setUser(null); // Clear user data on logout
//   };

//   // Set user info from an external call
//   const updateUser = (user: User) => {
//     setUser(user);
//   };

//   return (
//     <AuthContext.Provider value={{ isLogin, login, logout, role, user, setUser: updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };