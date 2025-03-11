import React, {useEffect, useState, useMemo} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';
import InfoHomeComponent from '../components/InfoHomeComponents/InfoHomeComponent.jsx';

export default function InfoHome() {
    useMemo(() => {
        getCurrentUserData()
    }, [])
    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, res => {
            if(res?.accessToken) {
                navigate('/home')
            } else {
                setLoading(false)
            }
        });
    }, []);
    return loading ? <Loader/> : <InfoHomeComponent />
}