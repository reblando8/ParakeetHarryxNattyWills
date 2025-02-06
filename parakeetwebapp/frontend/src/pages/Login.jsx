import React, {useEffect, useState} from 'react';
import LoginComponent from "../components/LoginComponent";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"


export default function Login() {
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
    return loading ? <Loader/> : <LoginComponent />;
}

