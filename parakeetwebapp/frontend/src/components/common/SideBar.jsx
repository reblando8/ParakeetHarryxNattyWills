import React, { useState } from 'react';
import logo from '../../images/ParakeetLogo.png';
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { BsPeopleFill, BsChatDotsFill, BsBellFill } from "react-icons/bs";
import { RiUserSearchFill } from "react-icons/ri";
import { MdTask, MdSchedule } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function SideBar({ currentUser }) {
    let navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const goToRoute = (route) => {
        navigate(route);
    }

    const handleSearchFocus = () => {
        setIsSearchOpen(true);
    };

    const handleSearchBlur = () => {
        // Delay closing to allow clicking on results
        setTimeout(() => setIsSearchOpen(false), 200);
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
                    
                    <div className="relative">
                        <div 
                            className="flex items-center space-x-3 text-gray-600 hover:text-black cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <AiOutlineSearch className="w-6 h-6" />
                            <span className="font-medium">Search</span>
                        </div>
                        
                        {/* Search Dropdown */}
                        {isSearchOpen && (
                            <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-50 p-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={handleSearchFocus}
                                        onBlur={handleSearchBlur}
                                    />
                                    <AiOutlineSearch className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
                                </div>
                                
                                {/* Search Results */}
                                {isSearchOpen && searchQuery && (
                                    <div className="mt-2 max-h-48 overflow-y-auto">
                                        {/* Example results - replace with actual search results */}
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                                            <p className="text-sm text-gray-700">Search Result 1</p>
                                        </div>
                                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                                            <p className="text-sm text-gray-700">Search Result 2</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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
                        onClick={() => goToRoute('/picks')}
                    >
                        <RiUserSearchFill className="w-6 h-6" />
                        <span className="font-medium">Personalized Picks</span>
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
        </div>
    );
} 