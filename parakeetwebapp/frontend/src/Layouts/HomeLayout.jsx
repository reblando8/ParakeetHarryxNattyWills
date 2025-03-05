import React, { useState, useMemo } from "react";
import Home from '../pages/Home'
import TopBar from '../components/common/TopBar'
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import { use } from "react";

export default function HomeLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser)
    }, [])
    return(
        <div className="flex flex-col w-screen min-h-screen">
            <div className="bg-[#f4f2ee] min-h-screen overflow-auto overscroll-y-auto">
                <Home currentUser={currentUser} />
            </div>
        </div>
    )
}