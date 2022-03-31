const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const userConfig = require("../config/user.config");
const role = require("../enums/role");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dailyCalorieLimit: {
    type: Number,
    required: true,
    default: userConfig.DAILY_CALORIE_LIMIT
  },
  role: {
    type: String,
    enum: [role.Admin, role.User],
    default: role.User
  },
  hash: String,
  salt: String,
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = getPasswordHash(password, this.salt);
};

UserSchema.methods.isValidPassowrd = function (password) {
  var hash = getPasswordHash(password, this.salt);
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + authConfig.JWT_EXPIRY_IN_DAYS);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    },
    authConfig.JWT_SECRET
  );
};

module.exports = mongoose.model("User", UserSchema, "users");

//#region Helpers

const getPasswordHash = (password, salt) => {
  return crypto
    .pbkdf2Sync(
      password,
      salt,
      authConfig.HASH_ITERATIONS,
      authConfig.HASH_KEYLEN,
      authConfig.HASH_DIGEST
    )
    .toString("hex");
};

//#endregion
