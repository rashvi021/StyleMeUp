document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You are not logged in! Redirecting to login page.");
        window.location.href = "login.html"; // Change this to your actual login page
        return; // Stop further execution if not logged in
    }

    // Fetch categories
    fetch("http://localhost:3000/api/v1/categories", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const categoriesList = document.getElementById("categoriesList");
        categoriesList.innerHTML = ""; // Clear previous content

        if (data.categories && data.categories.length > 0) {
            data.categories.forEach(category => {
                const li = document.createElement("li");
                li.textContent = category.name;
                categoriesList.appendChild(li);
            });
        } else {
            categoriesList.innerHTML = "<li>No categories found.</li>";
        }
    })
    .catch(error => console.error("Error fetching categories:", error));
});
