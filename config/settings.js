require("dotenv").config();

const mongoConfig = {
  database: "HarborCurrents",
  serverUrl: process.env.MONGO_URI,
};

module.exports = mongoConfig;
