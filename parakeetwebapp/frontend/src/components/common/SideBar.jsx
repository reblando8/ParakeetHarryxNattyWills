import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../images/ParakeetLogo.png';
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { BsPeopleFill, BsChatDotsFill, BsBellFill } from "react-icons/bs";
import { RiUserSearchFill } from "react-icons/ri";
import { MdTask, MdSchedule } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function SideBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
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
                    id: user?.uid,
                    email: user?.email
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

    const logout = () => {
        dispatch(logoutUser())
            .unwrap()
            .then(() => {
                toast.success("Logged Out Successfully!");
                navigate('/login');
            })
            .catch(() => {
                toast.error("Failed to Logout. Try Again!");
            });
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
                        Parakeet
                    </span>
                </div>
            </div>

            {/* Discover Section */}
            <div className="px-6 mb-8">
                <h2 className="text-gray-500 font-semibold text-sm mb-4 uppercase tracking-wider">
                    Discover
                </h2>
                <div className="space-y-4">
                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/home')}
                    >
                        <AiFillHome className="w-6 h-6" />
                        <span className="font-medium">Home</span>
                    </div>
                    
                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/search')}
                    >
                        <AiOutlineSearch className="w-6 h-6" />
                        <span className="font-medium">Search</span>
                    </div>

                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/notifications')}
                    >
                        <BsBellFill className="w-6 h-6" />
                        <span className="font-medium">Notifications</span>
                    </div>
                </div>
            </div>

            {/* Connect Section */}
            <div className="px-6">
                <h2 className="text-gray-500 font-semibold text-sm mb-4 uppercase tracking-wider">
                    Connect
                </h2>
                <div className="space-y-4">
                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/messages')}
                    >
                        <BsChatDotsFill className="w-6 h-6" />
                        <span className="font-medium">Messaging</span>
                    </div>

                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/network')}
                    >
                        <BsPeopleFill className="w-6 h-6" />
                        <span className="font-medium">Network</span>
                    </div>

                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/chat')}
                    >
                        <RiUserSearchFill className="w-6 h-6" />
                        <span className="font-medium">AI Chat</span>
                    </div>
                </div>
            </div>

            {/* Manage Section */}
            <div className="px-6 mt-8">
                <h2 className="text-gray-500 font-semibold text-sm mb-4 uppercase tracking-wider">
                    Manage
                </h2>
                <div className="space-y-4">
                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={goToProfile}
                    >
                        <CgProfile className="w-6 h-6" />
                        <span className="font-medium">Profile</span>
                    </div>

                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/tasks')}
                    >
                        <MdTask className="w-6 h-6" />
                        <span className="font-medium">Tasks</span>
                    </div>

                    <div 
                        className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => goToRoute('/schedule')}
                    >
                        <MdSchedule className="w-6 h-6" />
                        <span className="font-medium">Schedule</span>
                    </div>
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