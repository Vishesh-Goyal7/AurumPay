const rates = {
  VCASH: 1,
  VINR: 1 / 10,
  VUSD: 1 / 50,
  VLESS: 1 / 100
};

const toVCash = (amount, currency = 'VCASH') => {
  return amount * (rates[currency] || 1);
};

module.exports = { toVCash };
