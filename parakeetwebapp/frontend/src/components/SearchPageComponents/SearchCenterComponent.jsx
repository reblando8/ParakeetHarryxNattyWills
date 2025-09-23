import React, { useState } from "react";
import SearchBar from "../common/SearchBar/SearchBar";

export default function SearchCenterComponent({currentUser}) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (query) => {
        setIsSearching(true);
        // TODO: Implement search logic
        console.log("Searching for:", query);
        // Simulate search results
        setTimeout(() => {
            setSearchResults([]);
            setIsSearching(false);
        }, 1000);
    };

    return (
        <div className="flex-1 bg-white h-screen overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Search</h1>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="p-4">
                {isSearching ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((result, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <h3 className="font-semibold text-gray-800">{result.title}</h3>
                                <p className="text-gray-600">{result.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>No search results yet. Start typing to search!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
