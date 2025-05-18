const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
