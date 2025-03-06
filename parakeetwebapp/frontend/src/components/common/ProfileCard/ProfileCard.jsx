import React from "react";
import Post from "../Post";
import { useState, useMemo} from "react";
import { getSingleStatus, getSingleUser } from "../../../api/FirestoreAPI";
import { useLocation } from "react-router-dom";

export default function ProfileCard({ currentUser, onEdit }) {
    let location = useLocation();
    const [allStatus, setAllStatus] = useState([]);
    const [currentProfile, setCurrentProfile] = useState({});

    useMemo(() => {
        if (location.state?.id) {
            getSingleStatus(setAllStatus, location?.state?.id);
        }
        if (location.state?.email) {
            getSingleUser(setCurrentProfile, location?.state?.email );
        }
    }, []);
    console.log("location", location);
    console.log("allStatus", allStatus);
    console.log("currentProfile", currentProfile);

    // Determine which data source to use
    const profileData = Object.keys(currentProfile).length === 0 ? currentUser : currentProfile;
    
    // Check if this is the current user's profile by comparing emails
    const isCurrentUserProfile = profileData?.email === localStorage.getItem('userEmail');

    return (
        <>
            <div className="relative bg-white border border-gray-300 shadow-md rounded-lg p-8 w-full mb-16">
                {isCurrentUserProfile && (
                    <button onClick={onEdit} className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold cursor-pointer hover:bg-purple-600">
                        Edit
                    </button>
                )}

                {/* Header Section - Profile Picture, Name, and Basic Info */}
                <div className="flex items-start space-x-4 mb-8">
                    <img 
                        src={"https://via.placeholder.com/120"} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full border-4 border-gray-200"
                    />
                    <div className="flex-1"> 
                        <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                        <div className="mt-2 space-y-1">
                            <p className="text-lg text-gray-700">{profileData.sport} {profileData.position && `- ${profileData.position}`}</p>
                            <p className="text-gray-600">{profileData.team}</p>
                            <p className="text-gray-600">{profileData.location}</p>
                            <p className="text-gray-500 text-sm">{profileData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Physical Stats Section */}
                        {(profileData.height || profileData.weight) && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Physical Stats</h2>
                                <div className="flex space-x-8">
                                    {profileData.height && (
                                        <div>
                                            <span className="text-gray-600">Height:</span>
                                            <span className="ml-2 text-gray-900">{profileData.height}</span>
                                        </div>
                                    )}
                                    {profileData.weight && (
                                        <div>
                                            <span className="text-gray-600">Weight:</span>
                                            <span className="ml-2 text-gray-900">{profileData.weight}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Career Highlights Section */}
                        {profileData.careerHighlights && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Career Highlights</h2>
                                <p className="text-gray-700">{profileData.careerHighlights}</p>
                            </div>
                        )}

                        {/* Statistics Section */}
                        {profileData.stats && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Statistics</h2>
                                <p className="text-gray-700">{profileData.stats}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Experience Section */}
                        {profileData.experience && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Athletic Experience</h2>
                                <p className="text-gray-700">{profileData.experience}</p>
                            </div>
                        )}

                        {/* Education Section */}
                        {profileData.education && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Education</h2>
                                <p className="text-gray-700">{profileData.education}</p>
                            </div>
                        )}

                        {/* Interests Section */}
                        {profileData.interests && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Interests & Activities</h2>
                                <p className="text-gray-700">{profileData.interests}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full">
                {allStatus.filter((item) => {
                    return item.email === profileData.email;
                }).map((posts)=> {
                    return <Post posts={posts} key={posts.id}/>
                })}
            </div>
        </>
    );
}
