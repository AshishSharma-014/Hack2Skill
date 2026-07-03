// server.js
require('dotenv').config(); // Loads your .env file
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Allow backend to read JSON data

// A simple test route to check if the server is alive
app.get('/api/health', (req, res) => {
    res.json({ message: "Smart Constituency Backend is running successfully! 🚀" });
});

// We will import our actual routes here later
// const apiRoutes = require('./routes/apiRoutes');
// app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});