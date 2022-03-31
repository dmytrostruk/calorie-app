const User = require("../models/user");
const Food = require("../models/food");
const Role = require("../enums/role");
const authService = require("../services/auth");

module.exports.getGeneralReport = async function (req, res) {
  const jwt = authService.extractJwt(req);
  const now = new Date();

  const previousWeekQuery = {
    timestamp: { $gt: addDays(now, -14), $lt: addDays(now, -7) },
  };

  const currentWeekQuery = {
    timestamp: { $gt: addDays(now, -7), $lt: now },
  };

  try {
    const currentUser = await User.findById(jwt._id);

    if (currentUser.role !== Role.Admin) {
      res.status(401);
      res.json({ message: "User has no access rights.", success: false });
      return;
    }

    const previousWeek = await Food.count(previousWeekQuery);
    const currentWeek = await Food.count(currentWeekQuery);

    res.status(200);
    res.json({ previousWeek, currentWeek });
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

module.exports.getAverageReport = async function (req, res) {
  const jwt = authService.extractJwt(req);
  const now = new Date();
  const averageDays = 7;

  const query = {
    timestamp: { $gt: addDays(now, -averageDays), $lt: now },
  };

  try {
    const currentUser = await User.findById(jwt._id);

    if (currentUser.role !== Role.Admin) {
      res.status(401);
      res.json({ message: "User has no access rights.", success: false });
      return;
    }

    const data = {};
    const users = {};
    const result = [];

    const food = await Food.find(query).populate("user", "name email");

    food.forEach((item) => {
      let key = item.user.email;
      let userName = item.user.name;

      if (!users[key]) {
        users[key] = userName;
      }

      data[key] = data[key] ? data[key] + item.calorieValue : item.calorieValue;
    });

    Object.keys(data).forEach(key => {
      result.push({
        name: users[key],
        email: key,
        averageValue: (data[key] / averageDays).toFixed(2)
      });
    });

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json(err);
  }
};

// #region Private Methods

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// #endregion
