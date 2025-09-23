import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatComponent from '../components/ChatPageComponents/ChatComponent.jsx';
import Loader from '../components/common/Loader.jsx';

export default function Chat() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    if (authLoading) return <Loader />;
    if (!user) return null; // Will redirect via useEffect

    return <ChatComponent currentUser={user} />;
}