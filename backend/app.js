const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // ✅ Import axios
require('dotenv/config');


app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');


const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use(`${api}/cart`, cartRoutes);






// ✅ Virtual Try-On Route (Updated for multiple outfits)
const UNITY_SERVER_URL = "http://localhost:5001"; // Unity server URL

app.post('/try-on', async (req, res) => {
    const { userId, outfitIds } = req.body;

    if (!userId || !Array.isArray(outfitIds) || outfitIds.length === 0) {
        return res.status(400).json({ error: "Missing userId or outfitIds" });
    }

    try {
        // Send request to Unity for multiple outfits
        const response = await axios.post(`${UNITY_SERVER_URL}/process-tryon`, { userId, outfitIds });

        res.json(response.data); // Forward Unity's response to frontend
    } catch (error) {
        console.error("Error communicating with Unity:", error.message);
        res.status(500).json({ error: "Unity server not responding" });
    }
});

// Database Connection
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.log(err);
});

// Start the Server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle "Address in Use" error
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is in use. Trying another port...`);
        const newPort = PORT + 1; // Use next available port
        app.listen(newPort, () => {
            console.log(`Server is running on http://localhost:${newPort}`);
        });
    } else {
        console.error("Server error:", err);
    }
});
