# Express and node cache tutorial

This is a quick tutorial on how to cache api calls.

## What is caching?

Caching is the storing of data temporarily and retrieving data from a high-performance store (usually memory) either explicitly or implicitly.

**Advantage**: When using external api's, you may have a restricted number of calls or cost per api call. If your api data doesn't constantly update, this not only reduces the number of api calls made but also reduces the loading speed.

## Installation

Firstly, navigate to the directory where you would like to store your project from your terminal. Let's start by making our project.

Run the following command in your terminal:

```bash
mkdir cache-project
cd cache-project
```

Now let's initiate our **`package.json`** file with the default parameters and install our packages with the following commands:

```bash
npm init -y
npm i express node-cache axios cors
```

These commands should create a package.json which looks like this:

```json
{
  "name": "cache-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.27.2",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "node-cache": "^5.1.2"
  }
}
```

Now let's breakdown the packages:

1. **axios** - We'll use this package to make our api calls
2. **cors** - This will enable our server to interact with our client.
3. **express** - Our server of course.
4. **node-cache** - This is our cache middleware package.

## Server and Router

We'll now create our server and router:

```bash
touch index.js router.js
```

Let's paste the following code to our **`index.js`** file:

```javascript
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
```

Now let's quickly breakdown what we've just done:

1. Created our server and declared it on port **`8000`**.
2. Added our parser using **`express.json`**, added our **`cors`** and **`router`** (which we will add shortly).
3. Add a listener to signal our server is running.

Now let's create a quick router with a default home route and export it.

Let's paste the following code to our **`router.js`** file:

```javascript
const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send("Cache Project Home Page");
  res.status(200);
});

module.exports = router;
```

## Middleware

Let's now move onto our middleware. Let's start by creating a **`middleware`** folder and a file which we'll call **`crypto.cache.js`**.

```bash
mkdir middleware
touch middleware/crypto.cache.js
```

Now let's add the following to our **`crypto.cache.js`**:

```javascript
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
```

Let's breakdown what we've just done.

1. Imported **`node-cache`** and set the **`new Cache`** to 5 minutes `({ stdTTL: 60 * 5 })`
2. We'll make an async middleware function name **`cryptoCacheMiddleware`**.
3. Like any controller in express our middleware will take a **`req`** and **`res`** argument. In addition to this we'll add a **`next`** to skip this function if the conditions of our if statement is not met.
4. The **`cryptoCache`** checks if something **`has`** been stored under the name **`crypto-list`**
5. If something is stored under **`crypto-list`** then the **`get`** will return it rather than skipping to the controller.

## Services

Now we'll create a **`services`** folder which will store all our api calls.

```bash
mkdir services
touch services/fetch.js services/crypto.services.js
```

First, let's create a async fetch function using **axios**. Paste the following code into our **`fetch.js`** file.

```javascript
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
```

Now let's import that **`FetchApi`** function into our **`crypto.services.js`** file and create our api call.

```javascript
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
```

Let's quickly breakdown the code:

1. We've made an async function which takes the argument name **`amount`**.
2. Then we'll use **`FetchApi`** to make an api call from: [**`https://api2.binance.com/api/v3/ticker/24hr`**]("https://api2.binance.com/api/v3/ticker/24hr")
3. Finally we'll return the results and the number of results is determined by our amount argument.

## Controllers

Finally we'll create our controllers so let's run the following command in our terminal:

```bash
mkdir controllers
touch controllers/crypto.controllers.js
```

This should return a directory named **`controllers`** contianing a file named **`crypto.controllers.js`**.

```javascript
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
```

### Updating our router

Finally let's update **`router.js`** file but adding our middleware and controller.

```javascript
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
```

Run the server:

```bash
node index.js
```

## Running our server

Make the a GET request using the following link: [**http://localhost:8000/crypto**](http://localhost:8000/crypto).

You'll notice that the first call will take a couple seconds, but then if you re-run the call, for the next 5 minutes, it will return the same result from your first call instantly.

And that's all she wrote! Thanks for reading!
