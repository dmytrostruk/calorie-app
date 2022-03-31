const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const options = { usernameField: "email" };

const verifyFunction = (username, password, done) => {
  User.findOne({ email: username }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message: "User not found",
      });
    }

    if (!user.isValidPassowrd(password)) {
      return done(null, false, {
        message: "Password is wrong",
      });
    }

    return done(null, user);
  });
};

const strategy = new LocalStrategy(options, verifyFunction);

passport.use(strategy);
