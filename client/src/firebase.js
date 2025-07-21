// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "form-bcc10.firebaseapp.com",
  databaseURL: "https://form-bcc10-default-rtdb.firebaseio.com",
  projectId: "form-bcc10",
  storageBucket: "form-bcc10.appspot.com",
  messagingSenderId: "314691591409",
  appId: "1:314691591409:web:1ff8325256817f90cd1d50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Initialize and export Firebase Storage
export const storage = getStorage(app);
export const auth = getAuth(app);
