import React, { useState, useMemo } from "react";
import Chat from '../pages/Chat'
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';

export default function ChatLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser)
    }, [])
    return(
        <div className="flex flex-col w-screen min-h-screen">
            <div className="min-h-screen overflow-auto overscroll-y-auto">
                <Chat currentUser={currentUser} />
            </div>
        </div>
    )
}