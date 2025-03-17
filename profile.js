import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function loadProfile() {
    try {
        const response = await fetch("http://127.0.0.1:5000/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}` // Ensure auth token is included
            },
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Update user details in the profile page
            document.getElementById("profileName").innerText = data.fullName || "Not Provided";
            document.getElementById("profileEmail").innerText = data.email || "Not Provided";
            document.getElementById("profilePhone").innerText = data.phone || "Not Provided";
        } else {
            alert("Please log in first.");
            window.location.href = "login_page.html";
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// ✅ Run loadProfile() on page load
window.onload = loadProfile;
