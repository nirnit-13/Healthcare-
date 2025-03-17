// ✅ Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Your Firebase Config (Replace with actual values)
const firebaseConfig = {
    apiKey: "AIzaSyD3Q-2V2Yp-DdqfJnYCqxTM-mHucuGyI8Q",
    authDomain: "healthcare-b7dbb.firebaseapp.com",
    projectId: "healthcare-b7dbb",
    storageBucket: "healthcare-b7dbb.firebasestorage.app",
    messagingSenderId: "1073833256785",
    appId: "1:1073833256785:web:611d2bc8676b53d18a5570"
};


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
