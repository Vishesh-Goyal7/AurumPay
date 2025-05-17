const express = require('express');
const router = express.Router();
const {
  depositFunds,
  withdrawFunds,
  transferFunds,
  getTransactionHistory
} = require('../controllers/walletController');

const verifyToken = require('../middlewares/authMiddleware');

router.post('/deposit', verifyToken, depositFunds);
router.post('/withdraw', verifyToken, withdrawFunds);
router.post('/transfer', verifyToken, transferFunds);
router.get('/history', verifyToken, getTransactionHistory);

module.exports = router;
