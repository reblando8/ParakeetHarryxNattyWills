import React from 'react';
import { FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import logo from '../../../images/profile-user-svgrepo-com.svg';

export default function AddFriendsCard() {
    const profiles = [
        { id: 1, name: "Sarah Chen", title: "Software Engineer at Google" },
        { id: 2, name: "Michael Rodriguez", title: "Product Designer at Apple" },
        { id: 3, name: "Emma Thompson", title: "Marketing Lead at Meta" }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-1/2 mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-900">Add to your feed</h2>
                <FaInfoCircle className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>

            {/* Profiles */}
            <div className="space-y-4">
                {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-start space-x-3">
                        <img 
                            src={logo}
                            alt={profile.name} 
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div className="flex-1">
                            <h3 className="font-medium text-sm text-gray-900 hover:text-blue-600 cursor-pointer">
                                {profile.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {profile.title}
                            </p>
                            <button className="mt-2 px-4 py-1 border border-gray-500 rounded-full text-gray-600 text-sm hover:bg-gray-100 hover:border-gray-600 transition-colors">
                                + Track
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* See All Link */}
            <div className="mt-4 pt-2 border-t border-gray-200">
                <a href="#" className="flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                    See All Recommendations
                    <FaArrowRight className="ml-2 text-xs" />
                </a>
            </div>
        </div>
    );
}
