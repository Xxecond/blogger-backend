const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load .env file
connectDB();     // Connect to MongoDB

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes); // All auth routes start with /api/auth

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
