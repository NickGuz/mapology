const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./models/db");
const User = require("./sequelize");
const path = require('path');

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static(path.join(process.cwd() + "/build")));

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
})

app.post('/users', async (req, res) => {
  const users = await User.create(req.body);
  res.json(users);
})

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
