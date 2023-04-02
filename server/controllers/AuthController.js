const db = require("../models/db")

exports.loggedIn = () => {
  // TODO
};

exports.login = () => {
  // TODO
};

exports.logout = () => {
  // TODO
};

// exports.register = (req, res) => {
//   // TODO
//   const { email, username, pass } = req.body;

//   // insert new user into database
//   const user = {
//     email,
//     username,
//     pass,
//   };

//   db.query("INSERT INTO users_test SET ?", user, (error, results) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // registration successful
//     res.status(200).send("Registration Successful");
//   });
// }

exports.register = () => {
  // TODO
};

exports.changePassword = () => {
  // TODO
};

exports.deleteUser = () => {
  // TODO
};