import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {auth} from '../firebaseConfig'
import { signOut } from "firebase/auth";


export const LoginAPI = (email, password) => {
    try {
        let response = signInWithEmailAndPassword(auth, email, password);
        return response;
    } catch(err) {
        alert(err.errors.message);
    }
};


export const LogoutAPI = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    } catch (err) {
        console.error("Logout failed:", err.message);
    }
};

export const RegisterAPI = (email, password) => {
    try {
        let response = createUserWithEmailAndPassword(auth, email, password);
        return response;
    } catch(err) {
        alert(err.errors.message);
    }
};

export const GoogleSignInAPI = () => {
    try {
        let googleProvider = new GoogleAuthProvider;
        let res = signInWithPopup(auth, googleProvider)
        return res;
    } catch(err) {
        alert(err.errors.message);
    }
};

