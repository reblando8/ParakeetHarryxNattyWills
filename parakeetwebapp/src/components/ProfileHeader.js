import React from 'react';


function ProfileHeader() {
    return (
        <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg">
            <img className="w-24 h-24 rounded-full" src="/profile.jpg" alt="Profile" />
            <div>
                <h1 className="text-xl font-bold">Jane Doe</h1>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Follow</button>
            </div>
        </div>
    );
}

export default ProfileHeader;