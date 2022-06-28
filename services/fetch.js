const axios = require("axios");

const FetchApi = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = FetchApi;