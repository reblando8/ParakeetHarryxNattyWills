import React from "react";
import SideBar from "../common/SideBar";

export default function ProfileLeftComponent({currentUser}) {
    return ( 
        <div className="w-64 flex-none hidden md:block">
            <div className="w-full">
                <SideBar currentUser={currentUser} />
            </div>
        </div>
    );
}