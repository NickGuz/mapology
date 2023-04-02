const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
const cors = require("cors");
const routes = require("./AuthRouter");

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors());

// route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Mapology." });
});

app.use("/", routes);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
