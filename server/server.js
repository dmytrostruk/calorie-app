const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

require('./config/passport.config');

const dbConfig = require("./config/database.config");

const routes = require("./routes/base.route");
const authRoutes = require("./routes/auth.route");
const foodRoutes = require("./routes/food.route");
const userRoutes = require("./routes/user.route");
const reportRoutes = require("./routes/report.route");
const invitationRoutes = require("./routes/invitation.route");

const authController = require("./controllers/auth");

const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);
app.use("/api", foodRoutes);
app.use("/api", userRoutes);
app.use("/api", reportRoutes);
app.use("/api", invitationRoutes);
app.use("/api/auth", authRoutes);

app.use(authController.errorHandler);

mongoose
  .connect(dbConfig.URL)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const port = process.env.PORT || "8080";
app.set("port", port);

const server = http.createServer(app);

server.listen(port, function () {
  console.info(`Server is up and running on port ${port}`);
});
