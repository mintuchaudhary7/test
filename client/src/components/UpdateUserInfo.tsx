import { useAuth } from '../context/context'
import profilepic from '../assets/Images/profilePic.png';
import { useState } from 'react';
import { MdEdit } from "react-icons/md";
import axios from 'axios';


const UpdateUserInfo: React.FC = () => {
    const { userData } = useAuth();
    const [updateBio, setUpdateBio] = useState("");
    const [updateUsername, setUpdateusername] = useState("");

    const [showUpdateBioForm, setShowUpdateBioForm] = useState(false);
    const [showUpdateUsernameForm, setShowUpdateusernameForm] = useState(false);

    console.log(showUpdateBioForm)


    console.log("In update:", userData)


    async function handleBioUpdate() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token is missing.");
            return;
        }

        try {

            const response = await axios.patch("https://localhost:7145/api/User/UpdateBio",
                updateBio,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );


            console.log('Bio updated successfully:', response);
            setShowUpdateBioForm(false)
        } catch (error: any) {

            console.error("Error updating bio:", error.response || error);
        }
    }


    return (
        <div className="relative bg-gray-100 min-h-screen flex justify-center items-center py-10 px-4">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8">

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Update Your Information</h2>

                {/* Profile Image Section */}
                <div className="flex justify-center mb-6">
                    <img
                        className="rounded-full h-32 w-32 cursor-pointer border-4 border-yellow-500 hover:border-gray-300 transition-all duration-300"
                        src={userData.profilePic === null ? profilepic : `${userData.profilePic}`}
                        alt="Profile"
                    />
                </div>

                {/* Form for Updating Information */}
                <div className="space-y-6">
                    {/* Username Section */}
                    <div className="flex flex-col relative">
                        <label htmlFor="username" className="font-semibold text-lg text-gray-700 mb-2">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={userData.userName}
                            className="border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        // onChange={(e) => setUpdateusername(e.target.value)}
                        />

                        <div className='absolute top-14 right-4 '>
                            <MdEdit size={24} />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="flex flex-col relative">
                        <label htmlFor="bio" className="font-semibold text-lg text-gray-700 mb-2">Bio:</label>

                        <textarea
                            id="bio"
                            value={userData.bio}
                            className="border-b-2 border-gray-800 p-3 text-gray-700 focus:outline-none focus:border-yellow-500 resize-none"
                            placeholder="Update your bio"
                            //onChange={(e) => setUpdateBio(e.target.value)}
                            rows={1}
                        />
                        <div onClick={() => setShowUpdateBioForm(!showUpdateBioForm)}
                            className='absolute top-14 right-4 '>
                            <MdEdit size={24} />
                        </div>

                    </div>

                    {/* Email Section */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="font-semibold text-lg text-gray-700 mb-2">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={userData.email}
                            className="border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            readOnly
                        />
                    </div>
                </div>

                {/* Update Button Section */}
                <div className="mt-6 flex justify-center">
                    <button
                        className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                        onClick={() => alert("Update functionality not implemented yet")} // Call actual update function here
                    >
                        Save Changes
                    </button>
                </div>

            </div>

            {
                showUpdateBioForm && (
                    <div className="absolute bg-gray-900  bg-opacity-50 w-full h-full top-0 left-0 flex justify-center items-center">
                        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">

                            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Update Bio</h2>

                            {/* Bio Update Form */}
                            <form className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="bio" className="font-semibold text-lg text-gray-700 mb-2">Bio:</label>
                                    <textarea
                                        id="bio"
                                        value={updateBio}
                                        className="border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                                        placeholder="Update your bio"
                                        onChange={(e) => setUpdateBio(e.target.value)}
                                    />
                                </div>

                                {/* Button to Save or Cancel */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                                        onClick={handleBioUpdate}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                                        onClick={() => setShowUpdateBioForm(false)} // Close the form without saving
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default UpdateUserInfo;
