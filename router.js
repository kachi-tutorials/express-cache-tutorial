const { Router } = require("express");
const router = Router();
const { cryptoController } = require("./controllers/crypto.controllers");
const { cryptoCacheMiddleware } = require("./middleware/crypto.cache");

router.get("/", (req, res) => {
  res.send("Cache Project Home Page");
  res.status(200);
});
router.get("/crypto", cryptoCacheMiddleware, cryptoController);

module.exports = router;
