import React, {useEffect, useState} from 'react';
import HomeComponent from '../components/HomeComponent.jsx'
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"


export default function Home() {
    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, res => {
            if(!res?.accessToken) {
                navigate('/login')
            } else {
                setLoading(false)
            }
        });
    }, []);
    return loading ? <Loader/> : <HomeComponent />
}