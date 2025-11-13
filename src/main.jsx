import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7WV98FPXHTmp6jYBlRdesa2sfZcLlIG0",
  authDomain: "abhinav-website-8641c.firebaseapp.com",
  projectId: "abhinav-website-8641c",
  storageBucket: "abhinav-website-8641c.firebasestorage.app",
  messagingSenderId: "365033014193",
  appId: "1:365033014193:web:feb50b8aea0a52ae4f7390",
  measurementId: "G-F5M3KTELRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
