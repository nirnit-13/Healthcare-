import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function changePassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    // ✅ Password validation
    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
        passwordError.textContent = "Password must be at least 8 characters long and include a number and a special character.";
        return;
    }

    if (newPassword !== confirmPassword) {
        passwordError.textContent = "Passwords do not match.";
        return;
    }

    // ✅ Clear any previous errors
    passwordError.textContent = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/change_password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Password changed successfully!");
            window.location.href = "profile.html"; // Redirect to profile
        } else {
            passwordError.textContent = data.error || "Failed to change password.";
        }
    } catch (error) {
        passwordError.textContent = "An error occurred. Please try again.";
    }
}

// ✅ Ensure form calls `changePassword()` when submitted
document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();
    changePassword();
});
