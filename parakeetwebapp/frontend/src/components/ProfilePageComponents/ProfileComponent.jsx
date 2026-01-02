import React from "react";
import ProfileLeftComponent from "./ProfileLeftComponent";
import ProfileRightComponent from "./ProfileRightComponent";
import ProfileCenterComponent from "./ProfileCenterComponent";

export default function ProfileComponent() {
    return (
        <div className="flex w-full h-screen">
            <ProfileLeftComponent/>
            <ProfileCenterComponent />
            <ProfileRightComponent/>    
        </div>
    )
}