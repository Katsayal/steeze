const WardrobeItem = require('../models/WardrobeItem');
const Outfit = require('../models/Outfit');

exports.generateOutfit = async (req, res) => {
  try {
    const { mood, weather, tags } = req.body; 
    const userId = req.user.id;

    const filterTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    let query = { userId };
    if (filterTags.length) {
      query.styleTags = { $in: filterTags };
    }

    const wardrobeItems = await WardrobeItem.find(query);

    if (wardrobeItems.length === 0) {
      return res.status(404).json({ error: 'No wardrobe items match the criteria' });
    }

    const outfitItems = [];
    const shuffled = wardrobeItems.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(4, shuffled.length); i++) {
      outfitItems.push(shuffled[i]);
    }

    const newOutfit = new Outfit({
      userId,
      items: outfitItems.map(item => item._id),
      mood,
      weather,
      tags: filterTags,
    });
    await newOutfit.save();

    await newOutfit.populate('items');

    res.json({ outfit: newOutfit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Outfit generation failed' });
  }
};

exports.getSavedOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find({ userId: req.user.id }).populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outfits' });
  }
};

exports.deleteOutfit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Outfit.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ error: 'Outfit not found' });
    }

    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.updateOutfit = async (req, res) => {
  try {
    const { id } = req.params;
    const { mood, tags } = req.body;

    const outfit = await Outfit.findOne({ _id: id, userId: req.user.id });
    if (!outfit) return res.status(404).json({ error: 'Outfit not found' });

    if (mood) outfit.mood = mood;
    if (tags) outfit.tags = tags.split(',').map(t => t.trim());

    await outfit.save();
    res.json({ message: 'Outfit updated', outfit });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};
