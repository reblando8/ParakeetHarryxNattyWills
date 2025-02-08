import React from 'react';
import logo from '../../images/ParakeetLogo.png';
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { BsBriefcaseFill, BsPeopleFill, BsChatDotsFill, BsBellFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoPerson, IoChevronDown } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';




const profileImage = "https://www.gravatar.com/avatar/?d=mp"; // Default avatar


export default function TopBar() {
    const [isFocused, setIsFocused] = useState(false);
    let navigate = useNavigate();
    const goToRoute = (route) => {
        navigate(route);
    }
    return(
        <div>
        <nav className="bg-white shadow-md py-2 px-4 flex justify-center gap-[200px]">
            <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="w-12 h-12" />
                
                <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className={`transition-all duration-300 ease-in-out border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-purple-100 placeholder-gray-500 px-4 py-2 ${
                                isFocused ? 'w-96' : 'w-72'
                            }`}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
                        />
                        <AiOutlineSearch className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
                </div>
            </div>

            
            <div className="flex gap-8">

                <div className="flex flex-col items-center" onClick={() => goToRoute('/home')}>
                    <a className="text-gray-600 hover:text-black">
                        <AiFillHome className="w-6 h-6" />
                    </a>
                    <span className="text-sm font-medium text-gray-600">Home</span>
                </div>

                <div className="flex flex-col items-center" onClick={() => goToRoute()}>
                    <a className="text-gray-600 hover:text-black">
                        <BsPeopleFill className="w-6 h-6" />
                    </a>
                    <span className="text-sm font-medium text-gray-600">My Network</span>
                </div>

                <div className="flex flex-col items-center" onClick={() => goToRoute()}>
                    <a className="text-gray-600 hover:text-black">
                        <BsBriefcaseFill className="w-6 h-6" />
                    </a>
                    <span className="text-sm font-medium text-gray-600">Jobs</span>
                </div>

                <div className="flex flex-col items-center" onClick={() => goToRoute()}>
                    <a className="text-gray-600 hover:text-black">
                        <BsChatDotsFill className="w-6 h-6" />
                    </a>
                    <span className="text-sm font-medium text-gray-600">Messaging</span>
                </div>

                <div className="flex flex-col items-center" onClick={() => goToRoute()}>
                    <a className="text-gray-600 hover:text-black">
                        <BsBellFill className="w-6 h-6" />
                    </a>
                    <span className="text-sm font-medium text-gray-600">Notifications</span>
                </div>

                <div className="text-gray-600 hover:text-black flex flex-col items-center" onClick={() => goToRoute('/profile')}>
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

            </div>
        </nav>
    </div>
    )
}