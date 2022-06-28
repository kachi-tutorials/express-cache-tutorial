const FetchApi = require("./fetch");

const cryptoApi = async (amount) => {
  try {
    const result = await FetchApi(
      "https://api2.binance.com/api/v3/ticker/24hr"
    );
    return result.slice(0, amount);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  cryptoApi,
};