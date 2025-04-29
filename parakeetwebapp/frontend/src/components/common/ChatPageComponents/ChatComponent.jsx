import React from "react";
import ChatLeftComponent from "./ChatLeftComponent";
import ChatCenterComponent from "./ChatCenterComponent";

export default function ChatComponent({currentUser}) {
    return (
        <div className="flex w-full h-screen">
            <ChatLeftComponent/>
            <ChatCenterComponent currentUser = {currentUser}/>
        </div>
    )
}