const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const mapologyRoutes = require("./routers/MapologyRouter");
const authRoutes = require("./routers/AuthRouter");
const bodyParser = require("body-parser");

const prod = "https://mapology-1.herokuapp.com/";
const dev = "http://localhost:3000";
const url = process.env.NODE_ENV ? prod : dev;

const app = express();
// app.use(express.json()); // parses incoming requests with JSON payloads
app.use(bodyParser.json({ limit: "1000kb" }));
app.use(cors({ credentials: true, origin: url }));
app.use(express.static(path.join(process.cwd() + "/build")));

// Setup our routes
app.use("/api", mapologyRoutes);
app.use("/auth", authRoutes);

// Fix Heroku routing
// KEEP AS LOWER-MOST ROUTE
app.get("/*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
