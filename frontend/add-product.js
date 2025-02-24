document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("productForm");
    const categoryDropdown = document.getElementById("category");
    const message = document.getElementById("message");

    // ✅ Fetch categories from backend and populate dropdown
    fetch("http://localhost:3000/api/v1/categories")
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                let option = document.createElement("option");
                option.value = category._id;
                option.textContent = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching categories:", error));

    // ✅ Handle form submission
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        let formData = new FormData(form);
    
        // Debugging: Log form data
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            let response = await fetch("http://localhost:3000/api/v1/products", {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                let errorText = await response.text();
                throw new Error(`Server error: ${errorText}`);
            }
    
            let result = await response.json();
            message.style.color = "green";
            message.textContent = "Product uploaded successfully!";
            form.reset();
        } catch (error) {
            message.style.color = "red";
            message.textContent = "Error uploading product: " + error.message;
        }
    });
    
});
