// ✅ Import Firebase Modules
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login_form").addEventListener("submit", async function login(event) {
        event.preventDefault(); // ✅ Prevent form reload

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // ✅ Firebase Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User logged in:", user);

            // ✅ Get Firebase Token
            const idToken = await user.getIdToken();
            console.log("Firebase ID Token:", idToken);

            // ✅ Send Token to Flask Backend
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Login successful!");
                window.location.href = "profile.html"; // ✅ Redirect to Profile Page
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login error: " + error.message);
        }
    });
});
