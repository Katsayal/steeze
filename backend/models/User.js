const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    style: [String],
    gender: String,
    location: String,
  },
  wardrobe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WardrobeItem' }],
  savedOutfits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' }],
});

// ✅ Check if the model already exists before creating it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
