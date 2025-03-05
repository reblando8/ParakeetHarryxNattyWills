import React from 'react';
import adPic from '../../../images/randomImageForParakeet.jpeg';

export default function AdCard() {
    return (
        <div className="bg-white rounded-lg shadow-sm w-1/2 mt-4 relative">
            {/* Ad Image */}
            <img 
                src={adPic}  // Using picsum for a random placeholder image
                alt="Advertisement" 
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            />
            
            {/* Advertisement Label */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded">
                <span className="text-white text-xs">Advertisement</span>
            </div>
        </div>
    );
}
