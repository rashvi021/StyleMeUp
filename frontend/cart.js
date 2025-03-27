document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const tryOnButton = document.getElementById("try-on-btn");

    async function fetchCartItems() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("User ID not found.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/v1/cart/${userId}`);
            const cart = await response.json();

            cartContainer.innerHTML = "";
            if (!cart || !cart.items || cart.items.length === 0) {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            let totalPrice = 0;
            let outfitIds = []; // ✅ Store outfit IDs

            cart.items.forEach(item => {
                if (!item.name || !item.price) {
                    console.warn("Skipping item with missing details:", item);
                    return;
                }

                totalPrice += item.price * item.quantity;
                outfitIds.push(item.productId); // ✅ Collect outfit IDs

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

            tryOnButton.dataset.userId = userId;  // ✅ Attach userId to button
            tryOnButton.dataset.outfitIds = JSON.stringify(outfitIds); // ✅ Store outfit IDs

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

        // ✅ Add event listener to Try-On Button
        document.getElementById("try-on-btn").addEventListener("click", () => {
            const userId = tryOnButton.dataset.userId;
            const outfitIds = JSON.parse(tryOnButton.dataset.outfitIds);

            if (!userId || outfitIds.length === 0) {
                alert("No outfits selected for try-on.");
                return;
            }

            sendTryOnRequest(userId, outfitIds);
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

    // ✅ Function to send Try-On request
    async function sendTryOnRequest(userId, outfitIds) {
        try {
            const response = await fetch("http://localhost:3000/try-on", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, outfitIds }),
            });

            const data = await response.json();
            console.log("Try-On Response:", data);

            if (data.error) {
                alert("Error in virtual try-on: " + data.error);
            } else {
                alert("Try-on started successfully!");
            }
        } catch (error) {
            console.error("Error sending try-on request:", error);
        }
    }
});
