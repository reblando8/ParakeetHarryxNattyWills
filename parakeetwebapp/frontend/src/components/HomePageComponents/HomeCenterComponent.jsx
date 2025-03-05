import React from "react";
import PostUpdate from '../common/PostUpdate/postUpdate'
import ProfileCard from "../common/ProfileCard/ProfileCard";

export default function HomeCenterComponent({currentUser}) {
    return (
        <div className="flex-1 p-4 min-w-[900px]">
            <PostUpdate currentUser={currentUser} />
        </div>
    )
}