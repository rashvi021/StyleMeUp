document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.getElementById("total-price");

    async function fetchCartItems() {
        const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
        if (!userId) {
            console.error("User not logged in");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/cart/${userId}`);
            const cart = await response.json();
            cartContainer.innerHTML = "";

            if (!cart.items || cart.items.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            let totalPrice = 0;

            cart.items.forEach(item => {
                totalPrice += item.productId.price * item.quantity;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");

                cartItem.innerHTML = `
                    <img src="${item.productId.image}" alt="${item.productId.name}">
                    <div class="item-details">
                        <h2>${item.productId.name}</h2>
                        <p>Price: $${item.productId.price.toFixed(2)}</p>
                        <div class="quantity">
                            <button class="decrease" data-id="${item.productId._id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase" data-id="${item.productId._id}">+</button>
                        </div>
                    </div>
                    <button class="remove" data-id="${item.productId._id}">Remove</button>
                `;

                cartContainer.appendChild(cartItem);
            });

            totalPriceElement.textContent = totalPrice.toFixed(2);
            addEventListeners();
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    function addEventListeners() {
        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                const quantityElement = button.previousElementSibling;
                const newQuantity = parseInt(quantityElement.textContent) + 1;
                updateQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                const quantityElement = button.nextElementSibling;
                const newQuantity = Math.max(1, parseInt(quantityElement.textContent) - 1);
                updateQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                removeItem(productId);
            });
        });
    }

    async function updateQuantity(productId, newQuantity) {
        const userId = localStorage.getItem("userId");

        try {
            const response = await fetch(`http://localhost:3000/api/v1/cart/${userId}/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (!response.ok) {
                throw new Error("Failed to update quantity");
            }

            fetchCartItems(); // Refresh cart after update
        } catch (error) {
            console.error(error);
        }
    }

    async function removeItem(productId) {
        const userId = localStorage.getItem("userId");

        try {
            const response = await fetch(`http://localhost:3000/api/v1/cart/${userId}/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to remove item");
            }

            fetchCartItems(); // Refresh cart after removal
        } catch (error) {
            console.error(error);
        }
    }




    fetchCartItems();
});
