import React from "react";
import AddFriendsCard from "../common/AddFriends/AddFriendsCard";
import SubNotesCard from "../common/SubNotes/SubNotesCard";
export default function HomeRightComponent() {
    return (
        <div className="w-1/3 flex-none p-4 hidden md:block pl-0">
            <AddFriendsCard/>
            <SubNotesCard/>
        </div>

    )
}