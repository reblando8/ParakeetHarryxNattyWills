import React, { useState } from "react";
import { LoginAPI, RegisterAPI, GoogleSignInAPI } from "../api/authAPI.jsx";
import logo from '../images/ParakeetLogo.png';
import { postUserData } from "../api/FirestoreAPI.jsx";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";


export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");


    const navigate = useNavigate();

    const register = async () => {
        try {
            const res = await RegisterAPI(email, password);
            toast.success("Signed In To Parakeet!")
            navigate('/home')
            postUserData({
                name: name,
                email: email,
                achievements: "",
                careerHighlights: "",
                education: "",
                experience: "",
                height: "",
                interests: "",
                location: "",
                position: "",
                sport: "",
                stats: "",
                team: "",
                updatedAt: new Date().toISOString(),  // Generates current timestamp
                weight: ""
            });
            localStorage.setItem("userEmail", res.user.email)
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.message) // Show popup
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
    
                <h1 className="text-5xl font-medium text-center">Level Up Your Sponsorship Game.</h1>

                 {/* LOGIN CONTAINER */}
                <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] shadow-gray-400/50 rounded-xl p-10 w-[500px] space-y-4">
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="Email or Phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />
                    
                    <input
                        type="password"
                        placeholder="Password (6+ characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-500"
                    />

                    <button
                        onClick={register}
                        className="w-full bg-[#581DC1] text-white py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-200"
                    >
                        Agree and Join
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-2">
                        By clicking <strong>Agree & Join</strong> or <strong>Continue</strong>, you agree to the 
                        <a onClick={() => navigate("/user-agreement")} className="text-blue-600 hover:underline font-medium"> User Agreement</a>, 
                        <a onClick={() => navigate("/privacy-policy")} className="text-blue-600 hover:underline font-medium"> Privacy Policy</a>, and 
                        <a onClick={() => navigate("/cookie-policy")} className="text-blue-600 hover:underline font-medium"> Cookie Policy</a>.
                    </p>

                    <div id="or-separator" className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-3 text-gray-500 text-md font-medium">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={googleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition duration-200"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-6 h-6" />
                        Sign Up with Google
                    </button>

                    <div className="mt-6 text-center text-gray-600 text-md">
                        Already Registered? 
                        <a onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-medium"> Click Here</a>
                    </div>

                </div>
                {/* SUPPORT LINK BELOW LOGIN BOX */}
                <div className="text-center text-gray-600 text-md">
                    Looking for 
                    <a onClick={() => navigate('/support')} className="text-blue-600 hover:underline font-medium"> support?</a>
                </div>
            </div>            
        </div>
    );
}
