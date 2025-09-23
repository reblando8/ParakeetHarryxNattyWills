import React, { useState } from "react";
import SearchBar from "../common/SearchBar/SearchBar";
import { searchUsers } from "../../api/FirestoreAPI";

export default function SearchCenterComponent({currentUser}) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setIsSearching(true);
        
        try {
            const results = await searchUsers(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
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
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                            </h2>
                        </div>
                        {searchResults.map((user, index) => (
                            <div key={user.id || index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                        {user.profileImage ? (
                                            <img 
                                                src={user.profileImage} 
                                                alt={user.userName} 
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-600 font-semibold text-lg">
                                                {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg">{user.userName || 'Unknown User'}</h3>
                                        <p className="text-gray-600">{user.email}</p>
                                        {user.matchType && (
                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                                                Matched by {user.matchType}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchQuery ? (
                    <div className="text-center text-gray-500 py-8">
                        <p>No users found for "{searchQuery}"</p>
                        <p className="text-sm mt-2">Try searching with a different term</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>No search results yet. Start typing to search for users!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
