import React from "react";
import SideBar from "../SideBar";

export default function ChatLeftComponent({currentUser}) {
    return ( 
        <div className="w-64 flex-none hidden md:block">
            <div className="w-full">
                <SideBar currentUser={currentUser} />
            </div>
        </div>
    );
}