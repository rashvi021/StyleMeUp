document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.getElementById("total-price");

    async function fetchCartItems() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/v1/cart/${userId}`);
            const cart = await response.json();
            console.log("Cart API Response:", cart);

            cartContainer.innerHTML = "";
    
            if (!cart || !cart.items || cart.items.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            let totalPrice = 0;
    
            cart.items.forEach(item => {
                if (!item.name || !item.price) {
                    console.warn("Skipping item with missing details:", item);
                    return;
                }

                totalPrice += item.price * item.quantity;
    
                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = `
                    <p><strong>${item.name}</strong> - $${item.price} (Qty: <span id="qty-${item.productId}">${item.quantity}</span>)</p>
                    <button class="decrease" data-id="${item.productId}">-</button>
                    <button class="increase" data-id="${item.productId}">+</button>
                    <button class="remove" data-id="${item.productId}">Remove</button>
                `;
                cartContainer.appendChild(itemElement);
            });

            totalPriceElement.innerText = totalPrice.toFixed(2);
            addEventListeners();

        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }
    
    fetchCartItems();

    function addEventListeners() {
        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                const quantityElement = document.getElementById(`qty-${productId}`);
                const newQuantity = parseInt(quantityElement.textContent) + 1;
                updateQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                const quantityElement = document.getElementById(`qty-${productId}`);
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

            fetchCartItems();
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

            fetchCartItems();
        } catch (error) {
            console.error(error);
        }
    }
});
