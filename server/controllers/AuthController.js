const bcrypt = require("bcrypt");
const saltRounds = 10;
const { User } = require("../sequelize/sequelize");

exports.loggedIn = () => {
  // TODO
};

exports.login = () => {
  // TODO
};

exports.logout = () => {
  // TODO
};

exports.register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirmPassword) {
    return res.status(400).json({
      errorMessage: "Fields must not be empty",
    });
  }

  if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
    return res.status(404).json({
      errorMessage: "Invalid email",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(402).json({
      errorMessage: "Passwords don't match",
    });
  }

  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(500).json({
        errorMessage: "Failed to hash password",
      });
    }

    try {
      const user = await User.create({
        email: req.body.email,
        username: req.body.username,
        password: hash,
      });

      return res.status(200).json(user);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res.status(403).json({
          errorMessage: "Username already exists",
        });
      }
    }
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

exports.changePassword = () => {
  // TODO
};

exports.deleteUser = () => {
  // TODO
};
