import React from "react";
import SearchBar from '../common/SearchBar/SearchBar'

export default function ChatCenterComponent({currentUser}) {
    return (
        <div className="flex-1 p-4 min-w-[900px]">
            <div className="min-h-screen w-full bg-gray-100 p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 mt-6">
                    {/* Search Bar */}
                    <SearchBar />
                </div>
            </div>  
        </div>
    )
}