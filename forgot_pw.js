import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function forgotPassword() {
    const email = document.getElementById("email").value;

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/forgot_password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("successMessage").classList.remove("d-none"); // Show success message
        } else {
            alert(data.error || "Failed to send reset link. Please try again.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
}

// ✅ Attach function to form submission
document.getElementById("forgotPasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    forgotPassword();
});