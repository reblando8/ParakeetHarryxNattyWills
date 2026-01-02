import React from "react";
import { useSelector } from "react-redux";
import HomeLeftComponent from "./HomeLeftComponent";
import HomeRightComponent from "./HomeRightComponent";
import HomeCenterComponent from "./HomeCenterComponent"

export default function HomeComponent() {
    const currentUser = useSelector((state) => state.auth.user);
    
    return (
        <div className="flex w-full h-full">
            <HomeLeftComponent />
            <HomeCenterComponent />
            <HomeRightComponent/>
        </div>
    )
}