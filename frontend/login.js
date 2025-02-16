document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    function toggleForms() {
        if (loginForm.style.display === "none") {
            loginForm.style.display = "block";
            signupForm.style.display = "none";
        } else {
            loginForm.style.display = "none";
            signupForm.style.display = "block";
        }
    }

    // Login Function
    document.querySelector("#login-form button").addEventListener("click", async function () {
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
    alert("Unexpected response: " + await response.text()); // Show raw response if not JSON
    return;
}


        if (response.ok) {
            alert("Login Successful!");
            localStorage.setItem("token", data.token); // Store token for authentication
            window.location.href = "index.html"; // Redirect after login
        } else {
            alert(data.message || "Login Failed. Check your credentials.");
        }
    });

    // Signup Function
    document.querySelector("#signup-form button").addEventListener("click", async function () {
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
    alert("Unexpected response: " + await response.text()); // Show raw response if not JSON
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
