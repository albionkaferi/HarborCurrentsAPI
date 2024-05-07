const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { currents, users, series } = require("./config/mongoCollections");
require("dotenv").config();

const port = 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/currents", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Sign in to access data" });
  }
  const token = authHeader.split(" ")[1];
  let invalid = false;
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      invalid = true;
    }
  });
  if (invalid) {
    return res.status(403).send({ message: "Invalid token" });
  }
  const { time, depth, model } = req.query;
  if (!time) {
    return res.status(400).send({ message: 'Missing "time" query parameter' });
  }
  if (!depth) {
    return res
      .status(400)
      .send({ message: 'Missing "depth" query parameter.' });
  }
  if (!model) {
    return res
      .status(400)
      .send({ message: 'Missing "model" query parameter.' });
  }
  try {
    const currentsCollection = await currents();
    const found = await currentsCollection.findOne({
      time: time,
      depth: depth,
      model: model,
    });
    if (found) {
      res.send(found);
    } else {
      res.status(404).send({ message: "Data not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/series", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Sign in to access data" });
  }
  const token = authHeader.split(" ")[1];
  let invalid = false;
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      invalid = true;
    }
  });
  if (invalid) {
    return res.status(403).send({ message: "Invalid token" });
  }
  try {
    const seriesCollection = await series();
    const found = await seriesCollection.findOne({});
    if (found) {
      res.send(found);
    } else {
      res.status(404).send({ message: "Data not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "No credentials provided" });
  }
  try {
    const usersCollection = await users();
    const user = await usersCollection.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (!user) {
      res.status(401).send({ message: "Incorrect credentials" });
    } else if (password != user.password) {
      res.status(401).send({ message: "Incorrect credentials" });
    } else {
      const token = jwt.sign({ data: user }, process.env.SECRET_KEY);
      res.status(200).send({ message: "Correct credentials", token: token });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }
    res.status(200).send({ message: "Valid token" });
  });
});

app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
