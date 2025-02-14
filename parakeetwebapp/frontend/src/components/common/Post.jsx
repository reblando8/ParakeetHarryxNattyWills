import React from 'react';

export default function Post(status) { // Ensure props are properly destructured
    // ✅ Define your class variables inside the function scope
    const outerCardClass = "bg-white border border-gray-300 shadow-md rounded-lg p-4 w-full px-10 min-h-[110px] my-4";
    const profileImgClass = "w-12 h-12 rounded-full"; // Profile image styling
    const inputBoxClass = "flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer text-gray-600";
    console.log({status})
    return (
        <div className="max-w-3xl mx-auto w-full px-6">
            <div className={outerCardClass}> {/* ✅ Variable correctly used here */}
                <div className="flex items-center space-x-4">
                {status}
                </div>
            </div>
        </div>
    );
}
