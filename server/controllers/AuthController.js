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
  const user = await User.create(req.body);
  res.json(user);
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
