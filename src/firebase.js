// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth,GoogleAuthProvider,signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc,getDoc } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA73sDEDb8PSwf2uIIVbg0HZrLF3jOqFtI",
  authDomain: "cashflow-manager-c77f1.firebaseapp.com",
  projectId: "cashflow-manager-c77f1",
  storageBucket: "cashflow-manager-c77f1.appspot.com",
  messagingSenderId: "896642379693",
  appId: "1:896642379693:web:a2d2c2c641b24737867b24",
  measurementId: "G-0P35L80YS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};