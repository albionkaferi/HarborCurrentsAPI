require('dotenv').config();

const mongoConfig = {
    database: "HarborCurrents",
    serverUrl: process.env.MongoURI,
}

module.exports = mongoConfig;