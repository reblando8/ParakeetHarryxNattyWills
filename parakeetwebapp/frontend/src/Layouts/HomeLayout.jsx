import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import Home from '../pages/Home'

export default function HomeLayout() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        // Sync Firestore user data with Redux
        if (currentUser?.email) {
            getCurrentUserData((firestoreUser) => {
                if (firestoreUser) {
                    const mergedUser = { ...currentUser, ...firestoreUser };
                    dispatch(setUser(mergedUser));
                }
            });
        }
    }, [currentUser?.email, dispatch]);

    return(
        <div className="flex flex-col w-screen min-h-screen">
            <div className="bg-[#f4f2ee] min-h-screen overflow-auto overscroll-y-auto">
                <Home />
            </div>
        </div>
    )
}