import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

async function bookAppointment() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const symptoms = document.getElementById("symptoms").value;
    const doctor = document.getElementById("doctor").value;
    const date = document.getElementById("date").value;

    if (!doctor) {
        alert("Please select a doctor.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/book_appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, phone, symptoms, doctor, date })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Your appointment has been booked successfully.");
            window.location.href = "profile.html"; // Redirect after booking
        } else {
            alert(data.error || "Failed to book appointment.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
    }
}

// ✅ Ensure form calls `bookAppointment()` when submitted
document.getElementById("appointmentForm").addEventListener("submit", function (event) {
    event.preventDefault();
    bookAppointment();
});
