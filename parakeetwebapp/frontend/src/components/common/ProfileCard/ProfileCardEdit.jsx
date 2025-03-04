import React from "react";

export default function ProfileCard({ currentUser, onEdit }) {


    return (
        <>
            {<div className="relative bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full max-w-3xl mx-auto min-h-[250px]">
                <button onClick={onEdit} className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer">
                    Save
                </button>
                {/* Profile Picture and Name */}
                <div className="flex items-center space-x-4 mt-6">
                    Editing stuff
                </div>
            </div>}
        </>
        
    );
}
