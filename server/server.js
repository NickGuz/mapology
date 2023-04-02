const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./models/db");
const User = require("./sequelize");

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors());
app.use(express.static(path.join(process.cwd() + "/build")));

app.get('/register', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
})

app.post('/register', async (req, res) => {
  const users = await User.create(req.body);
  res.json(users);
})

// set port, listen for requests
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
