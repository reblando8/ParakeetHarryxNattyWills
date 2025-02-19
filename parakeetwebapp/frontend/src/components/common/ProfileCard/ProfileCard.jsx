import React from "react";

export default function ProfileCard({currentUser}) {
    return (
        <div> 
            {currentUser.name}
        </div>
    )
}