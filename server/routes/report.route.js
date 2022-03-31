const express = require("express");
const reportController = require("../controllers/report");
const authService = require("../services/auth"); 

const router = express.Router();
const routeAuth = authService.getRouteAuth();

router.get("/get-general-report", routeAuth, reportController.getGeneralReport);
router.get("/get-average-report", routeAuth, reportController.getAverageReport);

module.exports = router;
