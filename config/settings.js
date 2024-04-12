require("dotenv").config();

const mongoConfig = {
  database: "harborcurrents",
  serverUrl: process.env.MONGO_URI,
};

module.exports = mongoConfig;
