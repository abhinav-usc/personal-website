import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Sense from './SENSE.jsx'

// Lazy: the hub bundles the full ACL program (~1.6 MB) — keep it off the public pages.
const Hub = lazy(() => import('./Hub.jsx'))

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
getAnalytics(app);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sense" element={<Sense />} />
        <Route path="/hub" element={<Suspense fallback={null}><Hub /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
