import React, { useState, useEffect } from "react";
import SearchBar from "../common/SearchBar/SearchBar";
import { searchUsers } from "../../api/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export default function SearchCenterComponent({currentUser, filters = {}}) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setIsSearching(true);
        
        try {
            const results = await searchUsers(query, filters);
            setSearchResults(results);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Re-search when filters change, even without text query
    useEffect(() => {
        handleSearch(searchQuery || '');
    }, [filters]);

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
                                {searchQuery ? (
                                    <>Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"</>
                                ) : (
                                    <>Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} matching filters</>
                                )}
                            </h2>
                        </div>
                        {searchResults.map((user, index) => (
                            <div key={user.id || index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        {user.profileImage ? (
                                            <img 
                                                src={user.profileImage} 
                                                alt={user.userName} 
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-600 font-semibold text-xl">
                                                {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-gray-800 text-lg">{user.name || user.userName || 'Unknown User'}</h3>
                                            {user.matchType && (
                                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                    {user.matchType}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                                        
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                            {user.sport && (
                                                <div>
                                                    <span className="font-medium">Sport:</span> {user.sport}
                                                </div>
                                            )}
                                            {user.position && (
                                                <div>
                                                    <span className="font-medium">Position:</span> {user.position}
                                                </div>
                                            )}
                                            {user.location && (
                                                <div>
                                                    <span className="font-medium">Location:</span> {user.location}
                                                </div>
                                            )}
                                            {user.team && (
                                                <div>
                                                    <span className="font-medium">Team:</span> {user.team}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {user.education && (
                                            <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Education:</span> {user.education}
                                            </div>
                                        )}
                                        
                                        {user.experience && (
                                            <div className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Experience:</span> {user.experience}
                                            </div>
                                        )}
                                        
                                        {(user.height || user.weight) && (
                                            <div className="flex space-x-4 text-sm text-gray-600">
                                                {user.height && (
                                                    <span><span className="font-medium">Height:</span> {user.height}</span>
                                                )}
                                                {user.weight && (
                                                    <span><span className="font-medium">Weight:</span> {user.weight}</span>
                                                )}
                                            </div>
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
                        <p>No search results yet. {Object.values(filters).some(v => v && v !== '') ? 'Adjust filters to find users.' : 'Start typing or apply filters to search for users.'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
