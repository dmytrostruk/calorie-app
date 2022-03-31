const passport = require("passport");
const User = require("../models/user");
const Invitation = require("../models/invitation");

module.exports.login = function (req, res) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      var token = user.generateJwt();
      res.status(200);
      res.json({ token: token });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.register = async function (req, res) {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
  });

  user.setPassword(req.body.password);

  if (req.body.code) {
    await Invitation.updateOne({ code: req.body.code }, { isUsed: true });
  }

  user.save(function (err) {
    if (!err) {
      var token = user.generateJwt();

      res.status(201);
      res.json({ token: token });
    } else {
      res.status(500);
      res.json(err);
    }
  });
};

module.exports.errorHandler = function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: err.name + ": " + err.message });
  }
};
