document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart-button');

    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        const productName = productCard.getAttribute('data-name');
        const productPrice = productCard.getAttribute('data-price');

        if (!productId || !productName || !productPrice) {
          console.error('Missing product data.');
          alert('Error: Missing product information.');
          return;
        }

        // Step 1: Create OrderItem
        fetch('http://localhost:3000/api/v1/order-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: productId, quantity: 1 })
        })
        .then(response => response.json())
        .then(orderItemData => {
          console.log('OrderItem created:', orderItemData);

          // Step 2: Create Order with the OrderItem ID
          const orderData = {
            user: "USER_ID_PLACEHOLDER", // Replace with actual user ID
            orderItems: [orderItemData._id],
            shippingAddress1: "Placeholder Address",
            city: "Placeholder City",
            zip: "12345",
            country: "Placeholder Country",
            phone: "1234567890",
            status: "In Cart",
            totalPrice: productPrice
          };

          return fetch('http://localhost:3000/api/v1/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
        })
        .then(response => response.json())
        .then(orderData => {
          console.log('Order successfully created:', orderData);
          alert(`${productName} has been added to your cart!`);
        })
        .catch(error => {
          console.error('Error adding product to cart:', error);
          alert('Failed to add product to cart.');
        });
      });
    });
  });