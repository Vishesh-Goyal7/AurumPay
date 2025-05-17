const generateIFSC = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ifsc = '';
  for (let i = 0; i < 6; i++) {
    ifsc += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ifsc;
};

module.exports = generateIFSC;
