const Transaction = require('../models/Transaction');

const detectFraud = async (user, type, amount) => {
  const flags = {
    flagged: false,
    reason_flagged: null
  };

  const now = new Date();
  const accountAgeMinutes = (now - new Date(user.created_at)) / 60000;

  if (['withdraw', 'transfer'].includes(type) && amount > 0.8 * user.balance) {
    flags.flagged = true;
    flags.reason_flagged = 'High withdrawal or transfer';
  }

  if (amount >= 50000 && type === 'deposit' && accountAgeMinutes < 60) {
    flags.flagged = true;
    flags.reason_flagged = 'Suspicious funding on new account';
  }

  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const txnCount = await Transaction.countDocuments({
    $or: [
      { from_account: user.account_number },
      { to_account: user.account_number }
    ],
    timestamp: { $gte: oneMinuteAgo }
  });

  if (txnCount >= 3) {
    flags.flagged = true;
    flags.reason_flagged = 'Bot like rapid transactions';
  }

  return flags;
};

module.exports = detectFraud;
