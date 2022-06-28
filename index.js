const express = require("express");
const cors = require("cors");
const router = require("./router");
const App = express();
const Port = 8000; // Our server port

App.use(express.json());
App.use(cors());
App.use(router);

App.listen(Port, () => {
  console.log(`Cache app listening at http://localhost:${Port}/`);
});
