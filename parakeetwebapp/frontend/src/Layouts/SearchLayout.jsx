import React, { useState, useMemo } from "react";
import Home from '../pages/Home'
import TopBar from '../components/common/TopBar'
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import { use } from "react";
import Search from "../pages/Search.jsx";

export default function SearchLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser)
    }, [])
    return(
        <div className="flex flex-col w-screen min-h-screen">
            {/* <TopBar currentUser={currentUser} className="fixed top-0 left-0 w-full" /> */}
            <div className="z-10 bg-[#f4f2ee] min-h-screen">
                <Search  currentUser={currentUser} />
            </div>
        </div>
    )
}