// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const LogInRouter = express.Router();

// IMPORTING CONSTROLLERS
const logInController = require('../../controllers/login/sessionLogin');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
LogInRouter.post('/', logInController.logIn);

// EXPORTING ROUTER
module.exports = { LogInRouter }