const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');
const detectFraud = require('../utils/fraudCheck');
const { toVCash } = require('../utils/currencyConverter');

exports.depositFunds = async (req, res) => {
  const { amount, currency = 'VCASH' } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const user = await User.findById(userId);
    if (user.is_deleted) return res.status(403).json({ error: 'Account is deactivated' });
    const vAmount = toVCash(amount, currency);
    user.balance += vAmount;
    const { flagged, reason_flagged } = await detectFraud(user, 'deposit', vAmount);
    await user.save();
    await Transaction.create({
      txn_id: uuidv4(),
      type: 'deposit',
      to_account: user.account_number,
      amount : vAmount,
      flagged,
      reason_flagged
    });

    res.json({ message: 'Deposit successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.withdrawFunds = async (req, res) => {
  const { amount, currency = 'VCASH' } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const user = await User.findById(userId);
    if (user.is_deleted) return res.status(403).json({ error: 'Account is deactivated' });
    const vAmount = toVCash(amount, currency);
    if (user.balance < vAmount)
      return res.status(400).json({ error: 'Insufficient balance' });

    user.balance -= vAmount;
    const { flagged, reason_flagged } = await detectFraud(user, 'withdraw', vAmount);
    await user.save();
    await Transaction.create({
      txn_id: uuidv4(),
      type: 'withdraw',
      from_account: user.account_number,
      amount : vAmount,
      flagged,
      reason_flagged
    });

    res.json({ message: 'Withdrawal successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.transferFunds = async (req, res) => {
  const { to_account, to_ifsc, amount, currency = 'VCASH' } = req.body;
  const senderId = req.user.id;

  if (!amount || amount <= 0 || !to_account || !to_ifsc)
    return res.status(400).json({ error: 'Missing or invalid fields' });

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ account_number: to_account, ifsc: to_ifsc });
    if (sender.is_deleted) return res.status(403).json({ error: 'Sender account is deactivated' });
    if (receiver.is_deleted) return res.status(403).json({ error: 'Receiver account is deactivated' });
    const vAmount = toVCash(amount, currency);

    if (!receiver) return res.status(404).json({ error: 'Recipient not found' });
    if (sender.account_number === receiver.account_number)
      return res.status(400).json({ error: 'Cannot transfer to self' });
    if (sender.balance < vAmount)
      return res.status(400).json({ error: 'Insufficient balance' });

    const { flagged, reason_flagged } = await detectFraud(sender, 'transfer', vAmount);

    const session = await User.startSession();
    session.startTransaction();

    try {
      sender.balance -= vAmount;
      receiver.balance += vAmount;

      await sender.save({ session });
      await receiver.save({ session });

      await Transaction.create([{
        txn_id: uuidv4(),
        type: 'transfer',
        from_account: sender.account_number,
        to_account: receiver.account_number,
        amount : vAmount,
        flagged,
        reason_flagged
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.json({ message: 'Transfer successful', balance: sender.balance });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const accNum = user.account_number;
    const transactions = await Transaction.find({
      $or: [
        { from_account: accNum },
        { to_account: accNum }
      ]
    }).sort({ timestamp: -1 });

    const formatted = await Promise.all(transactions.map(async (txn) => {
      let direction = 'neutral';
      let amount = txn.amount;
      let sender_name = 'self';
      let sender_account = 'self';
      let recipient_name = 'self';
      let recipient_account = 'self';
      let currency_type = 'null'

      if (txn.type === 'deposit') {
        direction = 'in';
        currency_type = txn.currency;
      } else if (txn.type === 'withdraw') {
        direction = 'out';
        amount *= -1;
        currency_type = txn.currency;
      } else if (txn.type === 'transfer') {
        if (txn.from_account === accNum) {
          direction = 'out';
          amount *= -1;
          currency_type = txn.currency;
          const receiver = await User.findOne({ account_number: txn.to_account });
          recipient_name = receiver ? receiver.name : 'Unknown';
          recipient_account = txn.to_account;
        } else {
          direction = 'in';
          const sender = await User.findOne({ account_number: txn.from_account });
          sender_name = sender ? sender.name : 'Unknown';
          sender_account = txn.from_account;
          recipient_name = 'self';
          recipient_account = 'self';
          currency_type = txn.currency;
        }
      }

      return {
        txn_id: txn.txn_id,
        timestamp: txn.timestamp,
        type: txn.type,
        amount,
        sender_name,
        sender_account,
        recipient_name,
        recipient_account,
        currency_type
      };
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};