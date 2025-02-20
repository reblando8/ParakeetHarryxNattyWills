import React, { useState, useMemo } from "react";
import Home from '../pages/Home'
import TopBar from '../components/common/TopBar'
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import { use } from "react";
import Profile from "../pages/Profile.jsx";

export default function ProfileLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser)
    }, [])
    return(
        <div className="flex flex-col w-screen min-h-screen">
            <TopBar currentUser={currentUser} className="fixed top-0 left-0 w-full" />
            <div className="z-10 pt-16 bg-[#f4f2ee] min-h-screen">
                <Profile  currentUser={currentUser} />
            </div>
        </div>
    )
}