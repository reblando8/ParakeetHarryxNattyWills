import React from "react";

export default function ProfileCard({ currentUser }) {
    return (
        <div className="relative bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full max-w-3xl mx-auto min-h-[250px]">
            <button className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                Edit
            </button>
            {/* Profile Picture and Name */}
            <div className="flex items-center space-x-4 mt-6">
                <img 
                    src={currentUser.profilePicture || "https://via.placeholder.com/50"} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                />
                <div> 
                    <h3 className="text-2xl text-gray-700 font-semibold">{currentUser.name}</h3>
                    <p className="text-gray-500 text-sm">Email: {currentUser.email}</p>
                    <div className="text-gray-500 text-sm mt-2">
                        {currentUser.bio || "No bio available"}
                    </div>
                </div>
            </div>
        </div>
    );
}
