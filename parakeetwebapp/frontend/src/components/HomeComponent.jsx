import React from "react";
import HomeLeftComponent from "./HomeLeftComponent";
import HomeRightComponent from "./HomeRightComponent";
import HomeCenterComponent from "./HomeCenterComponent"

export default function HomeComponent() {
    return (
        <div className="flex w-full h-screen">
            <HomeLeftComponent/>
            <HomeCenterComponent/>
            <HomeRightComponent/>
        </div>

    )
}