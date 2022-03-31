const Food = require("../models/food");
const User = require("../models/user");
const Role = require("../enums/role");
const authService = require("../services/auth");

module.exports.addFood = function (req, res) {
  const jwt = authService.extractJwt(req);
  const user = req.body.user ? req.body.user._id : jwt._id;

  var food = new Food({
    user: user,
    name: req.body.name,
    calorieValue: req.body.calorieValue,
    timestamp: req.body.timestamp,
  });

  food.save(async function (err) {
    const created = await Food.findById(food._id).populate(
      "user",
      "name email"
    );

    if (!err) {
      res.status(201);
      res.json(created);
    } else {
      res.status(500);
      res.json(err);
    }
  });
};

module.exports.getFood = async function (req, res) {
  const jwt = authService.extractJwt(req);
  const user = await User.findById(jwt._id);

  let query = user.role === Role.Admin ? {} : { user: jwt._id };

  if (req.query.startDate || req.query.endDate) {
    query.timestamp = {};

    if (req.query.startDate) {
      query.timestamp.$gt = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      query.timestamp.$lt = new Date(req.query.endDate);
    }
  }

  try {
    const food = await Food.find(query).populate("user", "name email");

    res.status(200);
    res.json(food);
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

module.exports.deleteFood = async function (req, res) {
  const ids = req.body.ids;
  const query = { _id: { $in: ids } };

  try {
    const count = await Food.count(query);

    if (count == 0 || count !== ids.length) {
      res.status(404);
      res.json({ message: "Specified IDs were not found.", success: false });
      return;
    }

    await Food.deleteMany(query);

    res.status(200);
    res.json({ success: true });
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong.", success: false, error: err });
  }
};

module.exports.editFood = async function (req, res) {
  const newData = {
    name: req.body.name,
    calorieValue: req.body.calorieValue,
    timestamp: req.body.timestamp,
  };

  const query = { _id: req.body._id };
  const options = { new: true };

  try {
    const updated = await Food.findOneAndUpdate(query, newData, options);
    const food = await Food.findById(updated._id).populate(
      "user",
      "name email"
    );

    res.status(200);
    res.json(food);
  } catch (err) {
    res.status(500);
    res.json({ message: "Something went wrong.", success: false, error: err });
  }
};
