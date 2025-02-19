import React from 'react';

export default function Post({ posts }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[120px] h-auto my-4 relative"; 

    return (
        <div className="max-w-3xl mx-auto w-full px-6">
            <div className={outerCardClass}>
                {/* Name and Timestamp aligned properly */}
                <div className="text-gray-500 text-sm flex flex-col">
                    <span className="font-semibold text-gray-700">{posts.userName}</span>
                    <span className="text-xs">{posts.timeStamp}</span>
                </div>

                {/* Status content */}
                <div className="w-full mt-4 break-words whitespace-normal text-gray-800">
                    {posts.status}
                </div>
            </div>
        </div>
    );
}

