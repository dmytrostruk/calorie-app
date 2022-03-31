const User = require("../models/user");
const Role = require("../enums/role");
const authService = require("../services/auth");

module.exports.getUser = async function (req, res) {
  const jwt = authService.extractJwt(req);

  try {
    const user = await User.findById(jwt._id);

    res.status(200);
    res.json(user);
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

module.exports.getUsers = async function (req, res) {
  const jwt = authService.extractJwt(req);
  const query = { role: Role.User };

  try {
    const currentUser = await User.findById(jwt._id);

    if (currentUser.role !== Role.Admin) {
      res.status(401);
      res.json({ message: "User has no access rights.", success: false });
      return;
    }

    const users = await User.find(query).select("-hash -salt");

    res.status(200);
    res.json(users);

  } catch (err) {
    res.status(500);
    res.json(err);
  }
};
