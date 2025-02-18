import React from 'react';

export default function Post({ posts }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[120px] h-auto my-4 relative"; 

    return (
        <div className="max-w-3xl mx-auto w-full px-6">
            <div className={outerCardClass}>

                {/* Timestamp centered at the top */}
                <div className="absolute top-2 left-2 text-gray-500 text-sm">
                    {posts.timeStamp}
                </div>

                {/* Ensure text wraps and doesn't overflow */}
                <div className="flex items-center mt-6 break-words">
                    {posts.status}
                </div>
                    
            </div>
        </div>
    );
}
