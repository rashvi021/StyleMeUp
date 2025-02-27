document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const authLink = document.getElementById("auth-link"); // Navbar link

    function toggleForms() {
        if (loginForm.style.display === "none") {
            loginForm.style.display = "block";
            signupForm.style.display = "none";
        } else {
            loginForm.style.display = "none";
            signupForm.style.display = "block";
        }
    }

    // ✅ Check if user is logged in and update navbar
    function updateAuthLink() {
        const token = localStorage.getItem("token");

        if (authLink) {
            if (token) {
                authLink.textContent = "My Account";
                authLink.href = "account.html"; // Redirect to My Account page
            } else {
                authLink.textContent = "Sign In";
                authLink.href = "login.html"; // Redirect to Login page
            }
        }
    }

    // ✅ Call updateAuthLink on page load
    updateAuthLink();

    // ✅ Login Function
    document.querySelector("#login-form button").addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.querySelector("#login-form input[type='text']").value;
        const password = document.querySelector("#login-form input[type='password']").value;

        const response = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            alert("Unexpected response: " + await response.text());
            return;
        }

        if (response.ok) {
            alert("Login Successful!");
            localStorage.setItem("token", data.token); // Store token
            updateAuthLink(); // Update navbar
            window.location.href = "index.html"; // Redirect
        } else {
            alert(data.message || "Login Failed. Check your credentials.");
        }
    });

    // ✅ Signup Function
    document.querySelector("#signup-form button").addEventListener("click", async function (event) {
        event.preventDefault(); // Prevent form submission

        const name = document.querySelector("#signup-form input[type='text']").value;
        const email = document.querySelector("#signup-form input[type='email']").value;
        const password = document.querySelector("#signup-form input[type='password']").value;

        const response = await fetch("http://localhost:3000/api/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            alert("Unexpected response: " + await response.text());
            return;
        }

        if (response.ok) {
            alert("Signup Successful! Please log in.");
            toggleForms(); // Switch to login form
        } else {
            alert(data.message || "Signup Failed.");
        }
    });

    window.toggleForms = toggleForms; // Make function accessible in HTML
});
