const express = require('express');
const router = express.Router();
const {
  getFlaggedTransactions,
  getBalanceSummary,
  getTopUsers, 
  undoDelete
} = require('../controllers/adminController');

const verifyToken = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

router.get('/flagged', verifyToken, adminOnly, getFlaggedTransactions);
router.get('/balance-summary', verifyToken, adminOnly, getBalanceSummary);
router.get('/top-users', verifyToken, adminOnly, getTopUsers);
router.post('/undo-delete', verifyToken, adminOnly, undoDelete);

module.exports = router;
