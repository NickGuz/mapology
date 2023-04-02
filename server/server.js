const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./models/db")
// const routes = require("./routers/AuthRouter");

const app = express();
app.use(express.json()); // parses incoming requests with JSON payloads
app.use(cors());

// route
// app.use("/", routes);

app.get("/register", (req, res) => {
  db.query("SELECT * FROM users_test", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/register", (req, res) => {
  const insertQuery = "INSERT INTO users_test SET ?";

  db.query(insertQuery, req.body, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("User Added to Database");
    }
  });
});

// currently doesn't work
app.put("/register", (req, res) => {
  const updateQuery =
    "UPDATE users_test SET email = ?, username = ?, password = ?, WHERE id = ?";
  db.query(
    updateQuery,
    [req.body.email, req.body.username, req.body.password, req.body.id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
