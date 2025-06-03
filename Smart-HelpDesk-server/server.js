const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://swetanksinha23.github.io',
        // Add your Vercel deployment URL here when deployed:
        // 'https://your-app.vercel.app'
    ],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/kb', require('./routes/kbRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/agent', require('./routes/agentRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

// Database connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});