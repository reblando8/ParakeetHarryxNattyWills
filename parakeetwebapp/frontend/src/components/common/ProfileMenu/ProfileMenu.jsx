import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../store/slices/authSlice";
import { IoChevronDown } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null); // Ref for detecting off-click
    let profileImage =  "https://www.gravatar.com/avatar/?d=mp"; // Default avatar

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const logout = async () => {
        try {
            dispatch(logoutUser());
            toast.success("Logged Out Successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to Logout. Try Again!");
        }
    };

    const viewProfile = () => {
        navigate('/profile'); // Adjust the route if needed
        setIsOpen(false);
    };

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
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

            {/* Popup Card (Dropdown) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md rounded-lg p-2 z-50">
                    <div 
                        className="block w-full text-center px-4 py-2 text-gray-700 font-medium rounded-md cursor-pointer transition"
                        onClick={viewProfile}
                    >
                        {currentUser?.name || currentUser?.userName || currentUser?.email || "User"}
                    </div>
                    {/* View Profile Button */}
                    <button 
                        className="block w-full text-center px-4 py-2 border border-purple-500 text-purple-500 font-medium rounded-md hover:bg-purple-100 transition"
                        onClick={viewProfile}
                    >
                        View Profile
                    </button>

                    {/* Logout Button */}
                    <button 
                        className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md mt-1"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
