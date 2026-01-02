import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import Search from "../pages/Search.jsx";

export default function SearchLayout() {
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
            {/* <TopBar className="fixed top-0 left-0 w-full" /> */}
            <div className="z-10 bg-[#f4f2ee] min-h-screen">
                <Search />
            </div>
        </div>
    )
}