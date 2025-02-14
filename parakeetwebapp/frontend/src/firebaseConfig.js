// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0ehr80W_ESCk6X_0cEJb0wcSOOW7b3io",
  authDomain: "parakeetwebapp.firebaseapp.com",
  projectId: "parakeetwebapp",
  storageBucket: "parakeetwebapp.firebasestorage.app",
  messagingSenderId: "429053294726",
  appId: "1:429053294726:web:9c77eeab62a8e352093907",
  measurementId: "G-5BTV8BP32Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const firestore = getFirestore(app)

export {auth, app, analytics, firestore};