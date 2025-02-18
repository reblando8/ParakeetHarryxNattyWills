import React from 'react';

export default function Post({ posts }) {
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[110px] my-4 relative"; // Added `relative`
    const profileImgClass = "w-12 h-12 rounded-full";
    const inputBoxClass = "flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer text-gray-600";

    return (
        <div className="max-w-3xl mx-auto w-full px-6">
            <div className={outerCardClass}>
                {/* Timestamp at the top left, styled gray */}
                <div className="absolute top-2 left-2 text-gray-500 text-sm">
                    {posts.timeStamp}
                </div>

                <div className="flex items-center space-x-4 mt-4"> {/* Added margin to prevent overlap */}
                    {posts.status}
                </div>
            </div>
        </div>
    );
}
