import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function updateProfile() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const address = document.getElementById("address").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/edit_profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, phone, gender, dob, address })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Profile updated successfully!");
            window.location.href = "profile.html"; // Redirect to profile page
        } else {
            alert(data.error || "Failed to update profile.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
}

// ✅ Ensure form calls `updateProfile()` when submitted
document.getElementById("editProfileForm").addEventListener("submit", function (event) {
    event.preventDefault();
    updateProfile();
});
