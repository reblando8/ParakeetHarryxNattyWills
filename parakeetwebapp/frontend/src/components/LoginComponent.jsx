import React, { useState } from "react";
import { LoginAPI, RegisterAPI, GoogleSignInAPI } from "../api/authAPI.jsx";
import logo from '../images/ParakeetLogo.png';
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";


export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    
    const login = async () => {
        try {
            const res = await LoginAPI(email, password);
            toast.success("Signed In To Parakeet!")
            navigate('/home')
            localStorage.setItem("userEmail", res.user.email)
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Please Check Your Credentials") // Show popup
        }
    };

    const googleSignIn = async () => {
        try {
            const res = await GoogleSignInAPI();
            toast.success("Signed In To Parakeet!")
            navigate('/home')
            localStorage.setItem("userEmail", res.user.email)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="relative h-screen w-screen flex items-center justify-center">
            {/* LOGO IN THE TOP-LEFT CORNER */}
            <img 
                src={logo} // Path to your logo file
                alt="Logo"
                className="absolute top-10 left-10 h-100 w-100" // Positioned at the top-left
            />
            <div className="flex flex-col items-center justify-center h-screen space-y-7">
                {/* LOGIN CONTAINER */}
                <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.01)] shadow-gray-400/50 rounded-xl p-10 w-[500px]">
                    <div className="flex-column items-center justify-center mb-8">
                        <h1 className="text-5xl font-bold">Sign In</h1>
                        <h1 className="text-normal font-medium mt-4">Your Network. Your Sponsorship. Your Future.</h1>
                    </div>
                    <input
                        type="email"
                        placeholder="Email or Phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />
                    <button
                        onClick={login}
                        className="w-full bg-[#581DC1] text-white py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-200"
    >
                        Log In to Parakeet
                    </button>
                    <div id="or-separator" className="relative flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-md font-medium">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <button
                        onClick={googleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition duration-200"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-6 h-6" />
                        Log In with Google
                    </button>

                    <div className="mt-6 text-center text-gray-600 text-md">
                        New to the Parakeet Family? 
                        <a onClick={() => navigate('/register')} className="text-blue-600 hover:underline font-medium cursor-pointer"> Click Here</a>                   
                    </div>
                </div>
                
                <div className="text-center text-gray-600 text-md">
                        Looking for 
                        <a onClick={() => navigate('/support')} className="text-blue-600 hover:underline font-medium"> support?</a>
                </div>
            </div>
        </div>
    );
}
