const { cryptoCache } = require("../middleware/crypto.cache");
const { cryptoApi } = require("../services/crypto.services");

const cryptoController = async (req, res) => {
  try {
    const data = await cryptoApi(25);
    cryptoCache.set("crypto-list", data);
    res.send(data);
    res.status(200);
  } catch (err) {
    res.status(500);
    console.log(err);
    throw err;
  }
};

module.exports = {
  cryptoController,
};
