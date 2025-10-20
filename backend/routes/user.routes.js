const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadWardrobeItem,
  getUserWardrobe,
  updateWardrobeItem,
  deleteWardrobeItem
} = require('../controllers/user.controller');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

router.post('/wardrobe', auth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadWardrobeItem);
router.get('/wardrobe', auth, getUserWardrobe);
router.put('/wardrobe/:id', auth, updateWardrobeItem);
router.delete('/wardrobe/:id', auth, deleteWardrobeItem);

module.exports = router;
