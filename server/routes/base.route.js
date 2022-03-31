const express = require("express");
const testController = require("../controllers/test");
const authService = require("../services/auth"); 

const router = express.Router();
const routeAuth = authService.getRouteAuth();

router.get("/test", testController.test);
router.get("/protected-test", routeAuth, testController.protectedTest);

module.exports = router;
