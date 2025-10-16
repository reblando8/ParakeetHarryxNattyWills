import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatProfileCard({ user, onProfileClick, onTellMeMore }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onProfileClick) {
            onProfileClick(user);
        } else {
            navigate(`/profile/${user.id}`);
        }
    };

    const handleTellMeMore = (e) => {
        e.stopPropagation(); // Prevent profile click
        if (onTellMeMore) {
            onTellMeMore(user);
        }
    };

    return (
        <div 
            className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
            onClick={handleClick}
        >
            <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                            {user.name || user.userName || 'Unknown User'}
                        </h4>
                        {user.matchType && (
                            <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {user.matchType}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 text-xs mb-2 truncate">{user.email}</p>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        {user.sport && (
                            <div className="truncate">
                                <span className="font-medium">Sport:</span> {user.sport}
                            </div>
                        )}
                        {user.position && (
                            <div className="truncate">
                                <span className="font-medium">Position:</span> {user.position}
                            </div>
                        )}
                        {user.location && (
                            <div className="truncate">
                                <span className="font-medium">Location:</span> {user.location}
                            </div>
                        )}
                        {user.team && (
                            <div className="truncate">
                                <span className="font-medium">Team:</span> {user.team}
                            </div>
                        )}
                    </div>
                    
                    {(user.education || user.experience) && (
                        <div className="mt-1 text-xs text-gray-600">
                            {user.education && (
                                <div className="truncate">
                                    <span className="font-medium">Education:</span> {user.education}
                                </div>
                            )}
                            {user.experience && (
                                <div className="truncate">
                                    <span className="font-medium">Experience:</span> {user.experience}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Tell me more button */}
            <div className="mt-2 flex justify-end">
                <button
                    onClick={handleTellMeMore}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                    Tell me more
                </button>
            </div>
        </div>
    );
}
