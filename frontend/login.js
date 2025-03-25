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

    // ✅ Decode JWT to extract userId
    function getUserIdFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            return payload.userId; // Extract userId
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    // ✅ Check if user is logged in and update navbar
    function updateAuthLink() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (authLink) {
            if (token && userId) {
                authLink.textContent = "My Account";
                authLink.href = "account.html";
            } else {
                authLink.textContent = "Sign In";
                authLink.href = "login.html";
            }
        }
    }

    // ✅ Call updateAuthLink on page load
    updateAuthLink();

    // ✅ Login Function
    document.querySelector("#login-form button").addEventListener("click", async function (event) {
        event.preventDefault();

        const email = document.querySelector("#login-form input[type='text']").value;
        const password = document.querySelector("#login-form input[type='password']").value;

        try {
            const response = await fetch("http://localhost:3000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                // ✅ Extract userId from the token
                const userId = getUserIdFromToken(data.token);
                if (userId) {
                    localStorage.setItem("userId", userId);
                } else {
                    console.warn("userId not found in token.");
                }

                alert("Login Successful!");
                updateAuthLink();
                window.location.href = "index.html";
            } else {
                alert(data.message || "Login Failed. Check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        }
    });

    // ✅ Signup Function
    document.querySelector("#signup-form button").addEventListener("click", async function (event) {
        event.preventDefault();

        const name = document.querySelector("#signup-form input[type='text']").value;
        const email = document.querySelector("#signup-form input[type='email']").value;
        const password = document.querySelector("#signup-form input[type='password']").value;

        try {
            const response = await fetch("http://localhost:3000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup Successful! Please log in.");
                toggleForms();
            } else {
                alert(data.message || "Signup Failed.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Something went wrong. Please try again.");
        }
    });

    window.toggleForms = toggleForms; // Make function accessible in HTML
});
