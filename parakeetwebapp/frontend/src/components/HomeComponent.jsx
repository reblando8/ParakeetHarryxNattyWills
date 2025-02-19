import React from "react";
import HomeLeftComponent from "./HomeLeftComponent";
import HomeRightComponent from "./HomeRightComponent";
import HomeCenterComponent from "./HomeCenterComponent"

export default function HomeComponent({currentUser}) {
    return (
        <div className="flex w-full h-screen">
            <HomeLeftComponent/>
            <HomeCenterComponent currentUser = {currentUser}/>
            <HomeRightComponent/>
        </div>

    )
}