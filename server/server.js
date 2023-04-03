const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sequelize = require('./sequelize');
const { models } = require("./sequelize");
const path = require('path');

const prod = 'https://mapology-1.herokuapp.com/';
const dev = 'http://localhost:3000'
const url = (process.env.NODE_ENV ? prod : dev);

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors({ credentials: true, origin: url }));
app.use(express.static(path.join(process.cwd() + "/build")));

app.get('/users', async (req, res) => {
    const users = await models.post.findAll();
    res.json(users);
})

app.post('/users', async (req, res) => {
    const users = await models.post.create(req.body);
    res.json(users);
})

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// init database
const sequelizeInit = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
}

sequelizeInit();

module.exports = server;
