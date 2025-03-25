const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");


// ✅ Get cart items for a logged-in user
router.get("/:userId",  async (req, res) => {
    try {
        // if (req.user.userId !== req.params.userId) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }

        const cart = await Cart.findOne({ userId: req.params.userId }).populate({
            path: "items.productId",
            select: "name price image" // ✅ Ensure image is selected
        });
        
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart" });
    }
});

// ✅ Add item to cart
router.post("/",  async (req, res) => {
    const { userId, productId, name, price, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, name, price, quantity });
        }

        await cart.save();
        res.json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
});

// ✅ Update quantity in cart
router.put("/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        item.quantity = quantity; // ✅ Update the quantity
        await cart.save();

        res.json({ message: "Quantity updated", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to update quantity" });
    }
});


// ✅ Remove an item from the cart
router.delete("/:userId/:productId",  async (req, res) => {
    const { userId, productId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        await cart.save();

        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item" });
    }
});

module.exports = router;
