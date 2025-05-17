const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const generateAccountNumber = require('../utils/generateAccount');
const generateIFSC = require('../utils/generateIFSC');

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 0 },
  account_number: { type: String, unique: true },
  ifsc: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  created_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (!this.account_number) this.account_number = generateAccountNumber();
  if (!this.ifsc) this.ifsc = generateIFSC();
  next();
});

module.exports = mongoose.model('User', userSchema);
