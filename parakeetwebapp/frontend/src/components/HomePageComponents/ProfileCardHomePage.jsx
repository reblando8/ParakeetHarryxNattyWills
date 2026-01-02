import React from "react";
import { useSelector } from "react-redux";

export default function ProfileCardHomePage() {
    const currentUser = useSelector((state) => state.auth.user);
    
    return (
        <div className="flex justify-end pt-4"> {/* Updated class */}
            <div className="bg-white border border-gray-300 shadow-md rounded-lg p-3 h-[200px] flex flex-col justify-between">
                
                {/* Profile Picture and Name */}
                <div className="flex items-center space-x-3">
                    <img 
                        src={"https://via.placeholder.com/50"} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="overflow-hidden">
                        <h3 className="text-lg text-gray-700 font-semibold truncate">{currentUser?.name || currentUser?.userName || "User"}</h3>
                        <p className="text-gray-500 text-xs truncate">{currentUser?.email || ""}</p>
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="border-t pt-2 text-sm space-y-1">
                    <div className="flex justify-between text-gray-700">
                        <span>Views this week:</span>
                        <span className="font-bold">{currentUser.profileViews || 0}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Likes this week:</span>
                        <span className="font-bold">{currentUser.profileLikes || 0}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Sponsorships:</span>
                        <span className="font-bold">{currentUser.sponsorshipCount || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
