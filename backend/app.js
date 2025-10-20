
require('dotenv').config();
const userRoutes = require('./routes/user.routes');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const outfitRoutes = require('./routes/outfit.routes');
const weatherRoutes = require('./routes/weather.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/outfit', outfitRoutes);
app.use('/api/weather', weatherRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Steeze backend is running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port', process.env.PORT || 5000)
    );
  })
  .catch(err => console.error('MongoDB connection error:', err));
