import React, {useEffect} from 'react';
import { useSelector } from "react-redux";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"
import ProfileComponent from '../components/ProfilePageComponents/ProfileComponent.jsx'

export default function Profile() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (authLoading || !user) {
        return <Loader/>;
    }

    return <ProfileComponent />;
}