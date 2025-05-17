const express = require('express');
const router = express.Router();
const { register, login, softDeleteAccount } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
const verifyToken = require('../middlewares/authMiddleware');
router.delete('/soft-delete', verifyToken, softDeleteAccount);

module.exports = router;
