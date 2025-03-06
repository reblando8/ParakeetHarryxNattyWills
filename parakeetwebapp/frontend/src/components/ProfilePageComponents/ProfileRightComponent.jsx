import React from "react";
import AddFriendsCard from "../common/AddFriends/AddFriendsCard";
import SubNotesCard from "../common/SubNotes/SubNotesCard";
import AdCard from "../common/Advertisements/AdCard";
export default function ProfileRightComponent() {
    return (
        <div className="w-1/3 flex-none p-4 hidden md:block pl-0">
            <AddFriendsCard/>

            <AdCard/>

            <SubNotesCard/>

        </div>

    )
}