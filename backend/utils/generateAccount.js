const generateAccountNumber = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

module.exports = generateAccountNumber;
