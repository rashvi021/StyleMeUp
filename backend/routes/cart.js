const express = require('express');
const app = express();
app.use(express.json());

let cart = []; // Simulating a cart database

app.post('/cart', (req, res) => {
  const product = req.body;
  
  // Add product to cart
  cart.push(product);
  
  res.json({ success: true, message: 'Product added to cart.', cart });
});

app.listen(3000, () => console.log('Server running on port 3000'));
