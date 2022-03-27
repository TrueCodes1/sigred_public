// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const LogOutRouter = express.Router();

// IMPORTING CONSTROLLERS
const logOutController = require('../../controllers/login/sessionLogout');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
LogOutRouter.get('/', logOutController.logOut);

// EXPORTING ROUTER
module.exports = { LogOutRouter }