const invitationsController = require("../controllers/invitations");
const router = require('express').Router();
const { validateInviteToken } = require("../middlewares/invite");

// SEND INVITATION
router.post("/invites/accept/:token", validateInviteToken, invitationsController.registerInvite);

// VALIDATE INVITE
router.post("/invites/accept/:token", validateInviteToken, invitationsController.registerInvite);

// CREATE ACCOUNT
router.post("/invites/accept/:token", validateInviteToken, invitationsController.registerInvite);
