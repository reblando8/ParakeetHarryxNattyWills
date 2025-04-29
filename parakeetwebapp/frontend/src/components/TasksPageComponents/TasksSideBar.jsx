import React, { useState } from 'react';
import logo from '../../images/ParakeetLogo.png';
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { BsPeopleFill, BsChatDotsFill, BsBellFill } from "react-icons/bs";
import { RiUserSearchFill } from "react-icons/ri";
import { MdTask, MdSchedule } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { LogoutAPI } from "../../api/authAPI.jsx";
import { toast } from "react-toastify";
import TasksSidebarItem from './TasksSidebarItem.jsx';

export default function TasksSideBar({ currentUser }) {
    let navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const goToRoute = (route) => {
        navigate(route);
    }

    const goToProfileRoute = (route,state) => {
        navigate(route,state);
    }

    const goToProfile = () => {
        goToProfileRoute('/profile',
            {
                state: {
                    id: currentUser?.userID, 
                    email: currentUser?.email
                }
            }
        )
    };

    const handleSearchFocus = () => {
        setIsSearchOpen(true);
    };

    const handleSearchBlur = () => {
        // Delay closing to allow clicking on results
        setTimeout(() => setIsSearchOpen(false), 200);
    };

    const logout = async () => {
        try {
            await LogoutAPI();
            toast.success("Logged Out Successfully!");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to Logout. Try Again!");
        }
    };

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-md flex flex-col py-6">
            {/* Logo Section */}
            <div className="px-6 mb-8">
                <div className="flex items-center space-x-2">
                    <img 
                        src={logo} 
                        alt="Parakeet Logo" 
                        className="w-12 h-12 cursor-pointer" 
                        onClick={() => goToRoute('/home')}
                    />
                    <span 
                        className="text-orange-500 text-2xl font-semibold font-poppins cursor-pointer"
                        onClick={() => goToRoute('/home')}
                    >
                        Tasks App
                    </span>
                </div>
            </div>

            <div className="px-6 mb-8">
                <h2 className="text-gray-500 font-semibold text-sm mb-4 uppercase tracking-wider">
                    Task Items
                </h2>
                <div className="space-y-4">
                    <TasksSidebarItem 
                    label="Active Tasks" 
                    onClick={() => goToRoute('/home')} 
                    />
                    <TasksSidebarItem 
                    label="Nike Meetings" 
                    onClick={() => goToRoute('/tasks')} 
                    />
                    <TasksSidebarItem 
                    label="Complete" 
                    onClick={() => goToRoute('/notifications')} 
                    />
                </div>
            </div>

            {/* Logout Button */}
            <div className="mt-auto px-6">
                <button 
                    className="flex items-center space-x-3 text-red-600 hover:text-red-700 cursor-pointer p-2 rounded-lg hover:bg-red-50 w-full"
                    onClick={logout}
                >
                    <FiLogOut className="w-6 h-6" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
