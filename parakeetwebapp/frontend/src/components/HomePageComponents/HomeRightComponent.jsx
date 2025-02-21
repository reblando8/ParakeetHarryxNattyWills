import React from "react";
import NotificationsCardHomePage from "./HomePageNotificationsCard/NotificationsCardHomePage";

export default function HomeRightComponent() {
    return (
        <div className="w-1/4 flex-none p-4 hidden md:block pl-0">
            <NotificationsCardHomePage/>
        </div>

    )
}