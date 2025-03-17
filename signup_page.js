// ✅ Import Firebase Modules
import { auth, db } from "./firebase.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("signup_form").addEventListener("submit", async function register(event) {
        event.preventDefault(); // ✅ Prevent form reload

        const submitButton = document.querySelector("button[type='submit']");
        submitButton.disabled = true; // Prevent multiple clicks

        // ✅ Get input values
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const gender = document.getElementById("gender").value;
        const dob = document.getElementById("dob").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const termsAccepted = document.getElementById("terms").checked;

        // ✅ Basic Validation
        if (!fullName || !email || !dob || !password || !confirmPassword) {
            alert("Please fill out all required fields.");
            submitButton.disabled = false;
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            submitButton.disabled = false;
            return;
        }

        if (!termsAccepted) {
            alert("You must agree to the Terms & Conditions to continue.");
            submitButton.disabled = false;
            return;
        }

        try {
            // ✅ Register user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                phone: phone,
                gender: gender,
                dob: dob,
            });

            alert("Registration successful! Redirecting to login...");
            window.location.href = "login_page.html"; // Redirect to login page
        } catch (error) {
            console.error("Signup error:", error.message);
            alert("Signup error: " + error.message);
            submitButton.disabled = false; // Re-enable button
        }
    });
});

// ✅ Load Profile Function
export async function loadProfile() {
    const user = auth.currentUser;

    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            document.getElementById("profileName").textContent = docSnap.data().fullName;
            document.getElementById("profileEmail").textContent = docSnap.data().email;
            document.getElementById("profilePhone").textContent = docSnap.data().phone;
        } else {
            console.log("No user data found!");
        }
    } else {
        alert("No user logged in. Redirecting to login.");
        window.location.href = "login_page.html";
    }
}
