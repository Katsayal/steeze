const User = require('../models/User');
const bcrypt = require('bcryptjs');
const WardrobeItem = require('../models/WardrobeItem');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, preferences } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email) user.email = email;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Current password incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password change failed' });
  }
};

exports.uploadWardrobeItem = async (req, res) => {
  try {
    const { type, styleTags } = req.body;

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'Image is required' });
    }

    console.log('File received:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Handle empty or undefined styleTags
    const tagsArray = styleTags 
      ? styleTags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const item = new WardrobeItem({
      userId: req.user.id,
      type,
      styleTags: tagsArray,
      imageUrl: req.file.path,
    });

    await item.save();
    console.log('Item saved successfully:', item._id);

    res.status(201).json({ message: 'Item uploaded', item });
  } catch (err) {
    console.error('Upload error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};

exports.getUserWardrobe = async (req, res) => {
  try {
    const { type, tag, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (type) query.type = type;
    if (tag) query.styleTags = { $in: [tag] };

    const items = await WardrobeItem.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wardrobe' });
  }
};

exports.updateWardrobeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, styleTags } = req.body;

    const item = await WardrobeItem.findOne({ _id: id, userId: req.user.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (type) item.type = type;
    if (styleTags) {
      item.styleTags = styleTags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteWardrobeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await WardrobeItem.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!item) return res.status(404).json({ error: 'Item not found or already deleted' });

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};
