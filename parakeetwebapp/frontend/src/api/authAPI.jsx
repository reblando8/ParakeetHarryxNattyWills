import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import {auth, firestore} from '../firebaseConfig'
import { signOut } from "firebase/auth";

export const LoginAPI = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = res.user;
  
    // 👇 Grab user data by email from Firestore

    const q = query(collection(firestore, 'users'), where('email', '==', firebaseUser.email));
    const querySnap = await getDocs(q);
  
    let customData = {};
    let docId = null;
  
    if (!querySnap.empty) {
      const docSnap = querySnap.docs[0];
      customData = docSnap.data();
      docId = docSnap.id;
    } else {
      console.warn("No Firestore profile found for user:", firebaseUser.email);
    }
  
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || customData.name || '',
      userID: docId, // ✅ the actual Firestore document ID
      ...customData        // ✅ everything else: sport, actionId, etc
    };
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


