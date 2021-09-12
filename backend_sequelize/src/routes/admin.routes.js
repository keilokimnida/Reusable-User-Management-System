const router = require('express').Router();
const accountsController = require("../controllers/accounts");

// MIDDLEWARES
const { isLoggedIn } = require("../middlewares/login");

// ADMIN