const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWeatherByCoords } = require('../services/weather');

// GET /api/weather - Get current weather by coordinates
router.get('/', auth, async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const weatherData = await getWeatherByCoords(lat, lon);

    if (!weatherData) {
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }

    res.json(weatherData);
  } catch (err) {
    console.error('Weather fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

module.exports = router;
