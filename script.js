import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// script.js
document.addEventListener("DOMContentLoaded", function () {
    function navigateTo(page) {
        window.location.href = page;
    }

    // Attach event listeners to links
    document.querySelectorAll("[data-nav]").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            navigateTo(this.getAttribute("data-nav"));
        });
    });
});