import React from "react";

export default function AboutMe({ profileData }) {
    // If neither aboutMe nor skills exist, don't render anything
    if (!profileData.aboutMe && !profileData.skills) return null;

    return (
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-8 w-full mt-8">
            {/* About Me Section */}
            {profileData.aboutMe && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
                    <p className="text-gray-700 whitespace-pre-line">{profileData.aboutMe}</p>
                </div>
            )}
        </div>
    );
}
