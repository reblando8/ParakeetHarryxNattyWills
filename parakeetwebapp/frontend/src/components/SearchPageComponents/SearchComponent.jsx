import React from "react";
import HomeLeftComponent from "../HomePageComponents/HomeLeftComponent";
import HomeRightComponent from "../HomePageComponents/HomeRightComponent";
import SearchCenterComponent from "./SearchCenterComponent"

export default function HomeComponent({currentUser}) {
    return (
        <div className="flex w-screen h-screen">
            <HomeLeftComponent currentUser = {currentUser}/>
            <div className="flex-1">
                <SearchCenterComponent currentUser = {currentUser}/>
            </div>
            <HomeRightComponent/>
        </div>
    )
}
