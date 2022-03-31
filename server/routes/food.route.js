const express = require("express");
const foodController = require("../controllers/food");
const authService = require("../services/auth"); 

const router = express.Router();
const routeAuth = authService.getRouteAuth();

router.post("/add-food", routeAuth, foodController.addFood);
router.get("/get-food", routeAuth, foodController.getFood);
router.post("/delete-food", routeAuth, foodController.deleteFood);
router.patch("/update-food", routeAuth, foodController.editFood);

module.exports = router;
