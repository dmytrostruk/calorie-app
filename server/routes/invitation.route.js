const express = require("express");
const invitationController = require("../controllers/invitation");
const authService = require("../services/auth"); 

const router = express.Router();
const routeAuth = authService.getRouteAuth();

router.post("/send-invitation", routeAuth, invitationController.sendInvitation);
router.get("/validate-invitation-code", invitationController.validateInvitationCode);

module.exports = router;