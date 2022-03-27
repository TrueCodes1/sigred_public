// IMPORTING ALL NECCESSARY NODE MODULES
const express = require('express');

// DEFINING ROUTER
const GetLogInRouter = express.Router();

// IMPORTING CONSTROLLERS
const getLogInController = require('../../controllers/login/login');

// ASSIGNING SPECIFIC FUNCTIONS IN CONTROLLERS TO SPECIFIC ROUTES
GetLogInRouter.get('/', getLogInController.login);

// EXPORTING ROUTER
module.exports = { GetLogInRouter }