import React, { useState, useMemo, useEffect } from "react";
import Home from '../pages/Home'
import TopBar from '../components/common/TopBar'
import { getCurrentUserData, getUserById } from '../api/FirestoreAPI.jsx';
import { use } from "react";
import Profile from "../pages/Profile.jsx";
import { useParams } from "react-router-dom";

export default function ProfileLayout() {
    const [currentUser, setCurrentUser] = useState({});
    const { userId } = useParams();

    useEffect(() => {
        let unsubscribe = () => {};
        if (userId) {
            // Load specific user by id once
            (async () => {
                const user = await getUserById(userId);
                if (user) setCurrentUser(user);
            })();
        } else {
            // Subscribe to current user
            getCurrentUserData(setCurrentUser);
        }
        return () => {
            // no-op; getCurrentUserData handles its own subscription lifecycle
        };
    }, [userId]);
    return(
        <div className="flex flex-col w-screen min-h-screen">
            {/* <TopBar currentUser={currentUser} className="fixed top-0 left-0 w-full" /> */}
            <div className="z-10 bg-[#f4f2ee] min-h-screen">
                <Profile  currentUser={currentUser} />
            </div>
        </div>
    )
}