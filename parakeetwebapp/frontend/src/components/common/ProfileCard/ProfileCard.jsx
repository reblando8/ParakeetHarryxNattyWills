import React from "react";

export default function ProfileCard({ currentUser }) {
    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full max-w-3xl mx-auto">
            {/* Profile Picture and Name */}
            <div className="flex items-center space-x-4">
                <img 
                    src={currentUser.profilePicture || "https://via.placeholder.com/50"} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                />
                <div className="text-gray-700 font-semibold">{currentUser.name}</div>
            </div>

            {/* Additional Profile Info (Optional) */}
            <div className="text-gray-500 text-sm mt-2">
                {currentUser.bio || "No bio available"}
            </div>
        </div>
    );
}
