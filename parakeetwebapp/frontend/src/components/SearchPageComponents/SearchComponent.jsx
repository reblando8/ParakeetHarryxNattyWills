import React from "react";
import SearchLeftComponent from "./SearchLeftComponent";
import SearchRightComponent from "./SearchRightComponent";
import SearchCenterComponent from "./SearchCenterComponent";
import SideBar from "../common/SideBar";

export default function SearchComponent({currentUser}) {
    return (
        <div className="flex w-full h-screen">
            <div className="w-64 flex-none hidden md:block">
                <div className="w-full h-full">
                    <SideBar currentUser={currentUser} />
                </div>
            </div>
            <SearchLeftComponent/>
            <SearchCenterComponent currentUser = {currentUser}/>
            <SearchRightComponent/>    
        </div>
    )
}
