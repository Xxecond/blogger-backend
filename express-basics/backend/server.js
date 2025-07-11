const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // ✅ Add post routes

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://blogger-frontend-self.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // ✅ User-specific posts route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
