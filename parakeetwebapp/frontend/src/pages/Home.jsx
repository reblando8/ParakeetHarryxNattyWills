import React, {useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import HomeComponent from '../components/HomePageComponents/HomeComponent.jsx'

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        // Sync Firebase auth with Redux
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
            } else {
                // Merge with Firestore user data
                getCurrentUserData((firestoreUser) => {
                    if (firestoreUser) {
                        const mergedUser = { ...firebaseUser, ...firestoreUser };
                        dispatch(setUser(mergedUser));
                    } else {
                        dispatch(setUser(firebaseUser));
                    }
                });
            }
        });

        return () => unsubscribe();
    }, [dispatch, navigate]);

    if (authLoading || !user) {
        return <Loader/>;
    }

    return <HomeComponent />;
}