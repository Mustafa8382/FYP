
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "form-bcc10.firebaseapp.com",
  databaseURL: "https://form-bcc10-default-rtdb.firebaseio.com",
  projectId: "form-bcc10",
  storageBucket: "form-bcc10.appspot.com",
  messagingSenderId: "314691591409",
  appId: "1:314691591409:web:68f1bd1b1992a1ebcd1d50"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);