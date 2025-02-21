import React from "react";
import ProfileCardHomePage from "./ProfileCardHomePage";

export default function HomeLeftComponent({ currentUser }) {
    return ( 
        <div className="w-1/4 flex-none p-4 hidden md:block pr-0">
            <ProfileCardHomePage currentUser={currentUser} />
        </div>
    );
}
