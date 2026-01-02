import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { getCurrentUserData, getUserById } from '../api/FirestoreAPI.jsx';
import Profile from "../pages/Profile.jsx";
import { useParams } from "react-router-dom";

export default function ProfileLayout() {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (userId) {
            // Load specific user by id once
            (async () => {
                const user = await getUserById(userId);
                if (user) {
                    // For viewing other users' profiles, we might want to store in a separate state
                    // For now, we'll just use the current user from Redux
                }
            })();
        } else {
            // Sync Firestore user data with Redux
            if (currentUser?.email) {
                getCurrentUserData((firestoreUser) => {
                    if (firestoreUser) {
                        const mergedUser = { ...currentUser, ...firestoreUser };
                        dispatch(setUser(mergedUser));
                    }
                });
            }
        }
    }, [userId, currentUser?.email, dispatch]);
    
    return(
        <div className="flex flex-col w-screen min-h-screen">
            {/* <TopBar className="fixed top-0 left-0 w-full" /> */}
            <div className="z-10 bg-[#f4f2ee] min-h-screen">
                <Profile />
            </div>
        </div>
    )
}