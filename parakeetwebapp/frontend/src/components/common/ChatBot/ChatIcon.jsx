import React from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

export default function ChatIcon({ onClick, isOpen }) {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
                isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            aria-label="Open chat"
        >
            <HiChatBubbleLeftRight className="w-6 h-6 transition-transform duration-300" />
            {!isOpen && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">!</span>
                </div>
            )}
        </button>
    );
}
