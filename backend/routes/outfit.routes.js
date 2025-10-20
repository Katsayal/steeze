const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWeatherByCoords } = require('../services/weather');
const WardrobeItem = require('../models/WardrobeItem');
const Outfit = require('../models/Outfit');

const {
  getSavedOutfits,
  deleteOutfit
} = require('../controllers/outfit.controller');

// POST /api/outfit/generate - Generate outfit with weather integration
router.post('/generate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { styleTags, mood, lat, lon } = req.body;

    let weatherData = null;
    let weatherCondition = null;

    // Fetch weather data if coordinates provided
    if (lat && lon) {
      weatherData = await getWeatherByCoords(lat, lon);
      if (weatherData) {
        // Determine weather condition for outfit filtering
        if (weatherData.condition.includes('rain') || weatherData.condition.includes('drizzle')) {
          weatherCondition = 'rainy';
        } else if (weatherData.temperature <= 10) {
          weatherCondition = 'cold';
        } else if (weatherData.temperature >= 25) {
          weatherCondition = 'hot';
        } else {
          weatherCondition = 'mild';
        }
      }
    }

    // Build query for wardrobe items
    const query = { userId };
    if (styleTags && styleTags.length > 0) {
      query.styleTags = { $in: styleTags };
    }

    let wardrobeItems = await WardrobeItem.find(query);

    if (wardrobeItems.length === 0) {
      return res.status(404).json({ error: 'No wardrobe items match the criteria' });
    }

    // Smart filtering based on weather (optional - only if items don't have specific weather tags)
    let filteredItems = wardrobeItems;

    // Shuffle items for randomness
    const shuffled = filteredItems.sort(() => 0.5 - Math.random());

    // Select up to 4 items, trying to get variety
    const outfitItems = [];
    const types = ['shirt', 'pants', 'jacket', 'shoes'];
    
    for (const type of types) {
      const item = shuffled.find(i => i.type === type && !outfitItems.includes(i));
      if (item) outfitItems.push(item);
    }

    // If we don't have 4 items, add more random items
    for (const item of shuffled) {
      if (outfitItems.length >= 4) break;
      if (!outfitItems.includes(item)) {
        outfitItems.push(item);
      }
    }

    // Save the generated outfit to database
    const newOutfit = new Outfit({
      userId,
      items: outfitItems.map(item => item._id),
      mood,
      weather: weatherCondition,
      tags: styleTags || [],
    });
    await newOutfit.save();
    await newOutfit.populate('items');

    res.json({ 
      outfit: newOutfit,
      weatherInfo: weatherData ? {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        description: weatherData.description
      } : null
    });
  } catch (err) {
    console.error('Outfit generation error:', err);
    res.status(500).json({ error: 'Failed to generate outfit', details: err.message });
  }
});

router.get('/', auth, getSavedOutfits);
router.delete('/:id', auth, deleteOutfit);

module.exports = router;