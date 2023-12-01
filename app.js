const express = require('express');
const app = express();
const port = 8080

const { currents } = require('./config/mongoCollections');

app.get('/', async (req,res) => {
    const currentsCollection = await currents();
    const allCurrents = await currentsCollection.find({}).toArray();
    res.send(allCurrents);
})

app.listen(port, () => {
    console.log(`Server is now running on port ${port}`)
})