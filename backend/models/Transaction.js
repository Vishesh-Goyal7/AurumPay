const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txn_id: { type: String, unique: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
  from_account: { type: String },
  to_account: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'VCASH' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  flagged: { type: Boolean, default: false },
  reason_flagged: { type: String, default: null }
});

module.exports = mongoose.model('Transaction', transactionSchema);
