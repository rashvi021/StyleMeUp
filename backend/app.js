// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv/config');

// app.use(cors());
// app.options('*', cors());

// app.use(bodyParser.json());
// app.use(morgan('tiny'));

// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// const api = process.env.API_URL;

// //Routes
// const categoriesRoutes = require('./routes/categories');
// const productsRoutes = require('./routes/products');
// const usersRoutes = require('./routes/users');
// const ordersRoutes = require('./routes/orders');
// const cartRoutes = require('./routes/cart'); // ✅ Added cart route

// // **Register Routes**
// app.use(`${api}/categories`, categoriesRoutes);
// app.use(`${api}/products`, productsRoutes);
// app.use(`${api}/users`, usersRoutes);
// app.use(`${api}/orders`, ordersRoutes);
// app.use(`${api}/cart`, cartRoutes); // ✅ Register cart route

// //Database Connection
// mongoose.connect(process.env.CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'eshop-database'
// })
// .then(() => {
//     console.log('Database Connection is ready...')
// })
// .catch((err) => {
//     console.log(err);
// });

// //Server
// app.listen(3000, () => {
//     console.log(`Server is running on http://localhost:3000`);
// });


//gupu chnages

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

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// ✅ Add Virtual Try-On Route Below
const UNITY_SERVER_URL = "http://localhost:5001"; // Unity server URL

app.post('/try-on', async (req, res) => {
    const { userId, outfitId } = req.body;

    if (!userId || !outfitId) {
        return res.status(400).json({ error: "Missing userId or outfitId" });
    }

    try {
        // Send request to Unity's REST API
        const response = await axios.post(`${UNITY_SERVER_URL}/process-tryon`, { userId, outfitId });

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
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});