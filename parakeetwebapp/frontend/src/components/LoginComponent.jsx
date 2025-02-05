import React from "react";
import {LoginAPI } from "../api/authAPI.jsx";
import {login_button} from "../Styles/styles.js"
export default function LoginComponent() {

    const login = () => {
        LoginAPI();
    }
    return (
        <div>
            <h1>LoginComponent</h1>
            <button onClick={login} className={login_button}>
            Log In to Parakeet </button>
        </div>
    )
}