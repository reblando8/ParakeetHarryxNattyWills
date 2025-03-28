import React, { useState, useMemo } from "react";
import Search from '../pages/Search'
import TopBar from '../components/common/TopBar'
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import { use } from "react";

export default function SearchLayout() {
    const [currentUser, setCurrentUser] = useState({});
    useMemo(() => {
        getCurrentUserData(setCurrentUser)
    }, [])
    return(
        <div className="flex flex-col w-screen min-h-screen">
            <div className="bg-[#f4f2ee] min-h-screen overflow-auto overscroll-y-auto">
                <Search currentUser={currentUser} />
            </div>
        </div>
    )
}