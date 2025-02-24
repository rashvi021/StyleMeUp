document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("productsContainer");

    fetch("http://localhost:3000/api/v1/products")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                // Ensure a valid image URL
                let imageUrl = product.image && product.image.startsWith("http")
                    ? product.image
                    : `http://localhost:3000${product.image}`;

                // Set default fallback image if no valid image
                if (!product.image) {
                    imageUrl = "http://localhost:3000/public/uploads/fallback.jpg";
                }

                productCard.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name}" 
                        onerror="this.onerror=null; this.src='http://localhost:3000/public/uploads/fallback.jpg';">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button class="add-to-cart" data-id="${product._id}">Add to Cart</button>
                `;

                productsContainer.appendChild(productCard);
            });

            // Add event listeners for "Add to Cart" buttons
            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    addToCart(productId);
                });
            });
        })
        .catch(error => console.error("Error fetching products:", error));
});

// Function to add product to cart (store in localStorage)
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
}
