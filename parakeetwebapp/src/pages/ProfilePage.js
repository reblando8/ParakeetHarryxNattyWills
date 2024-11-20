import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import BioSection from '../components/BioSection';
import PostsSection from '../components/PostsSection';

function ProfilePage() {
    return (
        <div className="bg-gray-100 min-h-screen p-5 flex justify-center">
            <div className="w-full max-w-2xl">
                <ProfileHeader />
                <BioSection />
                <PostsSection />
            </div>
        </div>
    );
}

export default ProfilePage;
