const express = require("express");
const userController = require("../controllers/user");
const authService = require("../services/auth"); 

const router = express.Router();
const routeAuth = authService.getRouteAuth();

router.get("/get-user", routeAuth, userController.getUser);
router.get("/get-users", routeAuth, userController.getUsers);

module.exports = router;
