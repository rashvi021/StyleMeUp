document.addEventListener("DOMContentLoaded", () => {
    fetchUserData();
    document.getElementById("update-form").addEventListener("submit", updateUser);
    document.getElementById("logout").addEventListener("click", logout);
});

async function fetchUserData() {
    try {
        const response = await fetch('/api/v1/users/me');
        const data = await response.json();

        document.getElementById("user-name").textContent = data.name;
        document.getElementById("user-email").textContent = data.email;
        displayOrders(data.orders);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

async function updateUser(event) {
    event.preventDefault();

    const newName = document.getElementById("new-name").value;
    const newEmail = document.getElementById("new-email").value;

    try {
        const response = await fetch('/api/v1/users/update', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, email: newEmail }),
        });

        const data = await response.json();
        alert(data.message || "Profile updated!");
        fetchUserData();
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

async function logout() {
    await fetch('/api/v1/users/logout', { method: "POST" });
    window.location.href = "/login.html";
}

function displayOrders(orders) {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `Order #${order.id} - ${order.status}`;
        orderList.appendChild(li);
    });
}
