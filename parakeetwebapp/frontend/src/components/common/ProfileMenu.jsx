import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { LogoutAPI } from "../../api/authAPI.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ profileImage }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const logout = async () => {
        try {
            await LogoutAPI();
            toast.success("Logged Out Successfully!");
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to Logout. Try Again!");
        }
    };

    return (
        <div className="relative">
            {/* Profile Image and Dropdown Trigger */}
            <div className="text-gray-600 hover:text-black flex flex-col items-center cursor-pointer" onClick={toggleMenu}>
                <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full object-cover"
                />
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Me</span>
                    <IoChevronDown className="w-4 h-4" />
                </div>
            </div>

            {/* Popup Card */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-lg p-2 z-50">
                    <button 
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
