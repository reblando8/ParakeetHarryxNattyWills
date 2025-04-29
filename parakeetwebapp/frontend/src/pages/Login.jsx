import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';
import Loader from '../components/common/Loader.jsx';

export default function Login() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/home');
        }
    }, [user, authLoading, navigate]);

    if (authLoading) return <Loader />;
    if (user) return null; // Will redirect via useEffect

    return <LoginComponent />;
}

