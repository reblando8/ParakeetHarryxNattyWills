import React, {useEffect} from 'react';
import LoginComponent from "../components/LoginComponent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"


export default function Login() {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    return loading ? <Loader/> : <LoginComponent />;
}

