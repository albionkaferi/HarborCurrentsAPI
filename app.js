const express = require("express");
const app = express();
const port = 8080;
const { currents, users } = require("./config/mongoCollections");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const currentsCollection = await currents();
    const allCurrents = await currentsCollection.find({}).toArray();
    res.send(allCurrents);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/verify", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "No credentials provided" });
  }
  try {
    const usersCollection = await users();
    const found = await usersCollection.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (!found) {
      res.status(401).send({ message: "Authentication failed" });
    } else if (password != found.password) {
      res.status(401).send({ message: "Authentication failed" });
    } else {
      res.status(200).send({ message: "Credentials verified" });
    }
  } catch (e) {
    res.status(500).send({ e });
  }
});

app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});
