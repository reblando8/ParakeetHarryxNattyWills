import React from "react";
import PostUpdate from '../common/PostUpdate/postUpdate'
import ProfileCard from "../common/ProfileCard/ProfileCard";

export default function ProfileCenterComponent({currentUser}) {
    return (
        <div className="flex-1 p-4 bg-[#f4f2ee] min-w-[900px]">
            <ProfileCard currentUser={currentUser} />
        </div>

    )
}