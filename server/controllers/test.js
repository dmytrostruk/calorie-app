module.exports.test = function (req, res) {
  res.json({ message: "Test API works!" });
};

module.exports.protectedTest = function (req, res) {
  res.json({ message: "Protected test API works!" });
};