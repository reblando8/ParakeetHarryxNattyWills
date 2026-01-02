import React from "react";
import ProfileCardHomePage from "./ProfileCardHomePage";
import SideBar from "../common/SideBar";

export default function HomeLeftComponent() {
    return ( 
        <div className="w-64 flex-none hidden md:block">
            <div className="w-full">
                <SideBar />
            </div>
        </div>
    );
}
