import React, {useEffect, useState, useMemo} from 'react';
import TasksComponent from '../components/TasksPageComponents/TasksComponent.jsx'
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebaseConfig.js"
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader.jsx"
import { getCurrentUserData } from '../api/FirestoreAPI.jsx';


export default function Tasks({currentUser}) {
    useMemo(() => {
        getCurrentUserData()
    }, [])
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
    return loading ? <Loader/> : <TasksComponent currentUser={currentUser} />
}