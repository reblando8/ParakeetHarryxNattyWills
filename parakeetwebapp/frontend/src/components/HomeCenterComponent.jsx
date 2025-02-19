import React from "react";
import PostUpdate from './common/PostUpdate/postUpdate'

export default function HomeCenterComponent({currentUser}) {
    return (
        <div className="flex-1 p-4 bg-[#f4f2ee] min-w-[900px]">
           <PostUpdate currentUser={currentUser} />
        </div>

    )
}