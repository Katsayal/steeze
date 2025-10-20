const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
  createdAt: { type: Date, default: Date.now },
  mood: String,
  weather: String,
  tags: [String],
});

module.exports = mongoose.models.Outfit || mongoose.model('Outfit', outfitSchema);
