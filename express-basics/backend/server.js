const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ FIX: Allow frontend on Vercel to access backend
app.use(cors({
  origin: 'https://blogger-frontend-self.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
