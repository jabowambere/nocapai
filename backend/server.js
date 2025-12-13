const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nocap';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    console.log('⚠ Running in offline mode - authentication will not work');
  }
};

connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const { router: detectionRoutes } = require('./routes/detection');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/detection', detectionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Auth endpoints available at http://localhost:${PORT}/api/auth\n`);
});
