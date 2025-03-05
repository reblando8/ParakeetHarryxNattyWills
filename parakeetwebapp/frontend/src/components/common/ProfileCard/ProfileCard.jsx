import React from "react";

export default function ProfileCard({ currentUser, onEdit }) {
    return (
        <>
            <div className="relative bg-white border border-gray-300 shadow-md rounded-lg p-8 w-full max-w-3xl mx-auto min-h-[250px] mb-16">
                <button onClick={onEdit} className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer hover:bg-purple-600">
                    Edit
                </button>

                {/* Header Section - Profile Picture, Name, and Basic Info */}
                <div className="flex items-start space-x-4">
                    <img 
                        src={"https://via.placeholder.com/120"} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full border-4 border-gray-200"
                    />
                    <div className="flex-1"> 
                        <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                        <div className="mt-2 space-y-1">
                            <p className="text-lg text-gray-700">{currentUser.sport} {currentUser.position && `- ${currentUser.position}`}</p>
                            <p className="text-gray-600">{currentUser.team}</p>
                            <p className="text-gray-600">{currentUser.location}</p>
                            <p className="text-gray-500 text-sm">{currentUser.email}</p>
                        </div>
                    </div>
                </div>

                {/* Physical Stats Section */}
                {(currentUser.height || currentUser.weight) && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Physical Stats</h2>
                        <div className="flex space-x-8">
                            {currentUser.height && (
                                <div>
                                    <span className="text-gray-600">Height:</span>
                                    <span className="ml-2 text-gray-900">{currentUser.height}</span>
                                </div>
                            )}
                            {currentUser.weight && (
                                <div>
                                    <span className="text-gray-600">Weight:</span>
                                    <span className="ml-2 text-gray-900">{currentUser.weight}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Career Highlights Section */}
                {currentUser.careerHighlights && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Career Highlights</h2>
                        <p className="text-gray-700 whitespace-pre-line">{currentUser.careerHighlights}</p>
                    </div>
                )}

                {/* Statistics Section */}
                {currentUser.stats && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Statistics</h2>
                        <p className="text-gray-700 whitespace-pre-line">{currentUser.stats}</p>
                    </div>
                )}

                {/* Experience Section */}
                {currentUser.experience && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Athletic Experience</h2>
                        <p className="text-gray-700 whitespace-pre-line">{currentUser.experience}</p>
                    </div>
                )}

                {/* Education Section */}
                {currentUser.education && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
                        <p className="text-gray-700">{currentUser.education}</p>
                    </div>
                )}

                {/* Interests Section */}
                {currentUser.interests && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Interests & Activities</h2>
                        <p className="text-gray-700 whitespace-pre-line">{currentUser.interests}</p>
                    </div>
                )}
            </div>
        </>
    );
}
