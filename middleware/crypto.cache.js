const Cache = require("node-cache");
const cryptoCache = new Cache({ stdTTL: 60 * 5 });

const cryptoCacheMiddleware = (req, res, next) => {
  try {
    if (cryptoCache.has("crypto-list")) {
      return res.send(cryptoCache.get("crypto-list")).status(200);
    }
    return next();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  cryptoCacheMiddleware,
  cryptoCache,
};
